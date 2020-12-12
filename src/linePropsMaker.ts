import {ProgramLang} from './programmingLanguage';

export type TextProps = {
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
export class LinePropsMaker {
  private readonly rawText: string;
  private readonly startInBlockComment: boolean;
  private readonly lang: ProgramLang;
  private readonly purePropsArray: TextProps[];
  private readonly isEndedInBlockComment: boolean;

  constructor(rawText: string, startInBlockComment: boolean, lang: ProgramLang) {
    this.rawText = rawText;
    this.startInBlockComment = startInBlockComment;
    this.lang = lang;

    const {propsArray, isEndedInBlockComment} = this.makePurePropsArray();
    this.purePropsArray = propsArray;
    this.isEndedInBlockComment = isEndedInBlockComment;
  }

  makeLineProps(): {propsArray: TextProps[], isEndedInBlockComment: boolean} {
    let splitedArray: TextProps[] = [];
    for (const p of this.purePropsArray) {
      const array = (p.type !== 'comment') ? [p] : splitCommentProps(p);
      splitedArray = splitedArray.concat(array);
    }
    return {propsArray: splitedArray, isEndedInBlockComment: this.isEndedInBlockComment};
  }

  makePurePropsArray(): {propsArray: TextProps[], isEndedInBlockComment: boolean} {
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
      const result = isEndedInBlockComment ? this.searchInBlockComment(residualText) : this.searchOutBlockComment(residualText);
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
      propsArray = makePropsArray(array, true, hasResidual);
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
      propsArray = makePropsArray(array, false, hasResidual);
    } else if (array[0].includes(this.lang.getBlockComment().start)) {
      residualText = text.slice(regex.lastIndex, text.length);
      hasResidual = (residualText === '') ? false : true;
      isEndedInBlockComment = true;
      propsArray = makePropsArray(array, false, hasResidual);
    } else {
      throw new Error('ここには到達しないはず');
    }

    return {propsArray, residualText, hasResidual, isEndedInBlockComment};
  }
}


// ======================================================================
function makePropsArray(array: RegExpExecArray, inBlcokComment: boolean, hasResidual: boolean): TextProps[] {
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


// ======================================================================
function splitCommentProps(props: TextProps): TextProps[] {
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

  const propsArray1 = getTextProps('^' + pattern, props.raw);
  const propsArray2 = getTextProps(pattern + '$', props.raw);

  const result = (propsArray1.length > propsArray2.length)
    ? propsArray1 : propsArray2;

  return result;
}


// ======================================================================
function getTextProps(pattern: string, comment: string): TextProps[] {
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
