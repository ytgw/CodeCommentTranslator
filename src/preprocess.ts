import {ProgramLang} from './programmingLanguage';

type TextProps = {
  raw: string,
  type: 'source' | 'commentCommand' | 'comment' | 'nothing' | 'specialCharComment'
};

type SearchResult = {
  propsArray: TextProps[],
  isEndedInBlockComment: boolean,
  hasResidual: boolean,
  residualText: string,
}


// ======================================================================
class LineProps {
  private readonly propsArray: TextProps[];
  private readonly isEndedInBlockComment: boolean;

  constructor(lang: ProgramLang, raw: string, startInBlockComment: boolean) {
    const result = (new LinePropsMaker(raw, startInBlockComment, lang)).makeLineProps();
    this.propsArray = result.propsArray;
    this.isEndedInBlockComment = result.isEndedInBlockComment;
  }

  private needsNewLine(nextLineProps: LineProps): boolean {
    // 基本は改行必要
    let result = true;
    // コメントライクのみの行が連続するときは改行不要
    if (this.everyCommentLike() && nextLineProps.everyCommentLike()) {
      result = false;
    }
    // ただし、現在行か次行がコメントを一つも含まない場合は改行必要
    if (!this.some('comment') || !nextLineProps.some('comment')) {
      result = true;
    }
    return result;
  }

  private everyCommentLike(): boolean {
    // コメント、コマンド、特殊文字コメントのみで構成されればTrue
    const propsNum = this.propsArray.length;
    const commentNum = this.propsArray.filter(p => p.type === 'comment').length;
    const commandNum = this.propsArray.filter(p => p.type === 'commentCommand').length;
    const sepcialCharNum = this.propsArray.filter(p => p.type === 'specialCharComment').length;

    return propsNum === (commentNum + commandNum + sepcialCharNum);
  }

  private some(type: TextProps['type']): boolean {
    return this.propsArray.some(p => p.type === type);
  }

  private every(type: TextProps['type']): boolean {
    return this.propsArray.every(p => p.type === type);
  }

  getComments(separator=' '): string {
    return this.propsArray.filter(p => p.type === 'comment').map(p => p.raw).join(separator);
  }

  private endsHyphen(): boolean {
    const lastProps = this.propsArray[this.propsArray.length - 1];
    const lastType = (lastProps.type === 'comment') || (lastProps.type === 'specialCharComment');
    const lastChar = lastProps.raw[lastProps.raw.length - 1] === '-';

    return lastType && lastChar;
  }

  getAppendComment(nextLineProps: LineProps): string {
    // 改行が必要な場合は、コメント+改行
    if (this.needsNewLine(nextLineProps)) {
      return this.getComments() + '\n';
    }
    // 改行が不要な場合で、現在行の末尾文字がハイフンなら、ハイフンを消したコメント
    if (this.endsHyphen()) {
      return this.getComments().replace(/-$/, '');
    }
    // それ以外の改行が不要な場合は、コメント+空白
    return this.getComments() + ' ';
  }

  getIsEndedInBlockComment(): boolean {
    return this.isEndedInBlockComment;
  }
}


// ======================================================================
class LinePropsMaker {
  private readonly rawText: string;
  private readonly startInBlockComment: boolean;
  private readonly lang: ProgramLang;

  constructor(rawText: string, startInBlockComment: boolean, lang: ProgramLang) {
    this.rawText = rawText;
    this.startInBlockComment = startInBlockComment;
    this.lang = lang;
  }

  makeLineProps(): {propsArray: TextProps[], isEndedInBlockComment: boolean} {
    if (this.rawText === '') {
      return {
        propsArray: [{raw: '', type: 'nothing'}],
        isEndedInBlockComment: this.startInBlockComment,
      };
    }

    let hasResidual = true;
    let residualText = this.rawText;
    let isEndedInBlockComment = this.startInBlockComment;

    const propsArray: TextProps[] = [];
    while (hasResidual) {
      let result: SearchResult;
      if (isEndedInBlockComment) {
        result = this.searchInBlockComment(residualText);
      } else {
        result = this.searchOutBlockComment(residualText);
      }
      hasResidual = result.hasResidual;
      residualText = result.residualText;
      isEndedInBlockComment = result.isEndedInBlockComment;
      propsArray.push(...result.propsArray);
    }

    let splitedArray: TextProps[] = [];
    for (const p of propsArray) {
      const array = (p.type !== 'comment') ? [p] : LinePropsMaker.splitCommentProps(p);
      splitedArray = splitedArray.concat(array);
    }

    return {propsArray: splitedArray, isEndedInBlockComment};
  }

  private searchInBlockComment(text: string): SearchResult {
    // コメント文字列の前後にスペースやタブが0以上入っているパターン
    // replaceメソッドの目的は正規表現特殊文字のエスケープ
    const commentCommands = '\\s*('
      + this.lang.getBlockComment().end.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
      + ')\\s*';
    const regex = new RegExp(commentCommands, 'g');
    const array = regex.exec(text);

    let hasResidual = false;
    let residualText = '';
    let isEndedInBlockComment = true;
    let propsArray: TextProps[];
    if (array === null) {
      propsArray = [{raw: text, type: 'comment'}];
    } else {
      propsArray = LinePropsMaker.makePropsArray(array, true, hasResidual);
      residualText = text.slice(regex.lastIndex, text.length);
      hasResidual = (residualText === '') ? false : true;
      isEndedInBlockComment = false;
    }

    return {propsArray, residualText, hasResidual, isEndedInBlockComment};
  }

  private searchOutBlockComment(text: string): SearchResult {
    // コメント文字列の前後にスペースやタブが0以上入っているパターン
    // replaceメソッドの目的は正規表現特殊文字のエスケープ
    const commentCommands = '\\s*('
      + this.lang.getLineComment().replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
      + '|'
      + this.lang.getBlockComment().start.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
      + ')\\s*';
    const regex = new RegExp(commentCommands, 'g');
    const array = regex.exec(text);

    let hasResidual = false;
    let residualText = '';
    let isEndedInBlockComment = false;
    let propsArray: TextProps[] = [];
    if (array === null) {
      propsArray.push({raw: text, type: 'source'});
    } else if (array[0].includes(this.lang.getLineComment())) {
      propsArray = LinePropsMaker.makePropsArray(array, false, hasResidual);
    } else if (array[0].includes(this.lang.getBlockComment().start)) {
      residualText = text.slice(regex.lastIndex, text.length);
      hasResidual = (residualText === '') ? false : true;
      isEndedInBlockComment = true;
      propsArray = LinePropsMaker.makePropsArray(array, false, hasResidual);
    } else {
      throw new Error('ここには到達しないはず');
    }

    return {propsArray, residualText, hasResidual, isEndedInBlockComment};
  }

  static makePropsArray(array: RegExpExecArray, inBlcokComment: boolean, hasResidual: boolean): TextProps[] {
    const types: TextProps['type'][] = inBlcokComment
      ? ['comment', 'commentCommand', 'source']
      : ['source', 'commentCommand', 'comment'];

    const matchStr = array[0];
    const inputStr = array.input;
    const matchStartIndex = array.index;
    const matchEndIndex = matchStartIndex + matchStr.length;

    const propsArray: TextProps[] = [
      {raw: inputStr.slice(0, matchStartIndex), type: types[0]},
      {raw: matchStr, type: types[1]},
    ];
    if (!hasResidual) {
      propsArray.push({raw: inputStr.slice(matchEndIndex, inputStr.length), type: types[2]});
    }

    return propsArray.filter(p => p.raw !== '');
  }

  static splitCommentProps(props: TextProps): TextProps[] {
    if (props.type !== 'comment') {
      return [props];
    }

    // 1個以上の特殊文字パターン
    let specialChar = '(';
    for (const char of '#$%&-=^~\\|@+*<>?/') {
      specialChar += '|' + char.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
    }
    specialChar += ')*';

    // 1個以上の特殊文字の前後に、0個以上のスペースライク文字があるパターン
    const pattern = '(\\s*)' + specialChar + '(\\s*)';

    const propsArray1 = this.getTextProps('^' + pattern, props.raw);
    const propsArray2 = this.getTextProps(pattern + '$', props.raw);

    const result = (propsArray1.length > propsArray2.length)
      ? propsArray1 : propsArray2;

    return result;
  }

  static getTextProps(pattern: string, comment: string): TextProps[] {
    const regex = new RegExp(pattern);
    const array = regex.exec(comment);

    if (array === null) {
      return [{raw: comment, type: 'comment'}];
    }

    const matchStr = array[0];
    const matchStartIndex = array.index;
    const matchEndIndex = matchStartIndex + matchStr.length;

    const result: TextProps[] = [
      {raw: comment.slice(0, matchStartIndex), type: 'comment'},
      {raw: matchStr, type: 'specialCharComment'},
      {raw: comment.slice(matchEndIndex, comment.length), type: 'comment'},
    ];

    return result.filter(p => p.raw !== '');
  }
}


// ======================================================================
export function preprocessSourceCode(sourceCode: string, lang: ProgramLang): string {
  const lineList = sourceCode.split('\n');
  const LinePropsList: LineProps[] = [];
  let startInBlockComment = false;
  for (let i = 0; i < lineList.length; i++) {
    const element: LineProps = new LineProps(lang, lineList[i], startInBlockComment);
    startInBlockComment = element.getIsEndedInBlockComment();
    LinePropsList.push(element);
  }

  let result = '';
  let newLineNum = 0;
  for (let i = 0; i < LinePropsList.length - 1; i++) {
    const propsList = LinePropsList[i];
    const nextPropsList = LinePropsList[i+1];

    let addStr = propsList.getAppendComment(nextPropsList);
    if (!addStr.includes('\n')) {
      newLineNum += 1;
    } else {
      addStr += '\n'.repeat(newLineNum);
      newLineNum = 0;
    }
    result += addStr;
  }

  // 最終行のコメント
  result += LinePropsList[LinePropsList.length - 1].getComments();
  return result;
}
