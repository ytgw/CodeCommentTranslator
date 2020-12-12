import {ProgramLang} from './programmingLanguage';

type TextProps = {
  raw: string,
  type: 'source' | 'commentCommand' | 'comment'
};


// ======================================================================
class LineProps {
  private readonly lang: ProgramLang;
  private readonly propsArray: TextProps[]

  constructor(lang: ProgramLang, raw: string, /*startInBlockComment: boolean*/) {
    this.lang = lang;
    this.propsArray = this.calcPropsArray(raw);
  }

  calcPropsArray(raw: string): TextProps[] {
    const propsArray: TextProps[] = [];

    // コメント文字列の前後にスペースやタブが0以上入っているパターン
    // replaceメソッドの目的は正規表現の特殊文字をエスケープ
    const commentCommands = '\\s*('
      + this.lang.getLineComment().replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
      + '|'
      + this.lang.getBlockComment().start.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
      + '|'
      + this.lang.getBlockComment().end.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
      + ')\\s*';
    const regex = new RegExp(commentCommands, 'g');

    const array = regex.exec(raw);
    if (array === null) {
      return [{raw: raw, type: 'source'}];
    }

    const commandStartIdx = regex.lastIndex - array[0].length;
    const commandEndIdx = regex.lastIndex;

    if (commandStartIdx > 0) {
      propsArray.push({raw: raw.slice(0, commandStartIdx), type: 'source'});
    }
    propsArray.push({raw: raw.slice(commandStartIdx, commandEndIdx), type: 'commentCommand'});
    propsArray.push({raw: raw.slice(commandEndIdx, raw.length), type: 'comment'});
    return propsArray;
  }

  isOnlyComment(): boolean {
    return this.propsArray.filter(props => props.type === 'source').length === 0;
  }

  getComments(separator=' '): string {
    return this.propsArray.filter(p => p.type === 'comment').map(p => p.raw).join(separator);
  }

  endsHyphen(): boolean {
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
}


// ======================================================================
export function preprocessSourceCode(sourceCode: string, lang: ProgramLang): string {
  const lineList = sourceCode.split('\n');
  const LinePropsList: LineProps[] = [];
  for (let i = 0; i < lineList.length; i++) {
    LinePropsList.push(new LineProps(lang, lineList[i]));
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
