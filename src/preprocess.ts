import {ProgramLang} from './programmingLanguage';

type TextProps = {
  raw: string,
  type: 'source' | 'commentCommand' | 'comment'
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

  private isOnlyComment(): boolean {
    return this.propsArray.filter(props => props.type === 'source').length === 0;
  }

  getComments(separator=' '): string {
    return this.propsArray.filter(p => p.type === 'comment').map(p => p.raw).join(separator);
  }

  private endsHyphen(): boolean {
    const lastProps = this.propsArray[this.propsArray.length - 1];
    const lastType = lastProps.type === 'comment';
    const lastChar = lastProps.raw[lastProps.raw.length - 1] === '-';

    return lastType && lastChar;
  }

  getAppendComment(nextLineProps: LineProps): string {
    // 連続したコメントのみの行があれば、改行無して空白追加
    // ただしその場合でも、現在行の末尾文字が「-」なら、ハイフンを消して、空白と改行は無し
    // それ以外はコメント+改行
    if (this.isOnlyComment() && nextLineProps.isOnlyComment()) {
      if (this.endsHyphen()) {
        const comment = this.getComments();
        return comment.slice(0, comment.length - 1);
      } else {
        return this.getComments() + ' ';
      }
    } else {
      return this.getComments() + '\n';
    }
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

    return {propsArray, isEndedInBlockComment};
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
      hasResidual = true;
      residualText = text.slice(regex.lastIndex, text.length);
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
      hasResidual = true;
      residualText = text.slice(regex.lastIndex, text.length);
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
