import {ProgramLang} from './programmingLanguage';
import {TextProps, LinePropsMaker} from './linePropsMaker';


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
