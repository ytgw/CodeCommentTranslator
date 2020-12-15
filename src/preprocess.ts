import {ProgramLang} from './programmingLanguage';
import {TypedText, Comment, SourceCodeAnalyzer} from './sourceCodeAnalyzer';


// ======================================================================
class LineFormatter {
  private readonly comment: string;
  private readonly hasSrc: boolean;

  constructor(typedTexts: TypedText[]) {
    // 行頭と行末の特殊文字を削除したい。
    // そのために、1個以上の特殊文字の前後に、0個以上のスペースライク文字があるパターンを作成
    let specialChar = '(';
    for (const char of '#$%&=^~\\|@+*<>?/') {
      specialChar += '|' + char.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
    }
    specialChar += ')*';
    const pattern = '(\\s*)' + specialChar + '(\\s*)';

    const startRegExp = new RegExp(`^${pattern}`);
    const endRegExp = new RegExp(`${pattern}$`);

    // 空リストに対するmapは空リストを返し、空リストに対するjoinは空文字列を返す。
    typedTexts = typedTexts.filter(t => t.text.length > 0);
    const comment = typedTexts.filter(t => t.type === 'comment').map(t => t.text).join(' ');
    // 行頭と行末の特殊文字を削除。
    this.comment = comment.replace(startRegExp, '').replace(endRegExp, '');

    this.hasSrc = typedTexts.filter(
      t => (t.type === 'source') || (t.type === 'stringLiteral')
    ).length > 0;
  }

  getComment(): string {
    return this.comment;
  }

  getAppendComment(nextLineFormatter: LineFormatter): string {
    // 改行が必要な場合は、コメント+改行
    if (this.needsNewLine(nextLineFormatter)) {
      return this.getComment() + '\n';
    }
    // 改行が不要な場合で、現在行の末尾文字がハイフンなら、ハイフンを消したコメント
    if (this.endsHyphenComment()) {
      return this.getComment().replace(/-$/, '');
    }
    // それ以外の改行が不要な場合は、コメント+空白
    return this.getComment() + ' ';
  }

  private needsNewLine(next: LineFormatter): boolean {
    // 基本は改行必要
    let result = true;
    // コメントライクのみの行が連続するときは改行不要
    if (this.everyCommentLike() && next.everyCommentLike()) {
      result = false;
    }
    // ただし、現在行か次行がコメントを一つも含まない場合は改行必要
    if (!this.hasAnyComment() || !next.hasAnyComment()) {
      result = true;
    }
    return result;
  }

  private everyCommentLike(): boolean {
    return !this.hasSrc;
  }

  private hasAnyComment(): boolean {
    return this.comment.length > 0;
  }

  private endsHyphenComment(): boolean {
    return this.comment.slice(-1)[0] === '-';
  }
}


// ======================================================================
class CommentFormatter {
  private readonly typedTexts: TypedText[];
  private readonly lineFormatters: LineFormatter[];
  private readonly document: string;

  constructor(typedTexts: TypedText[]) {
    this.typedTexts = typedTexts;
    this.lineFormatters = this.splitByNewLine();
    this.document = this.format();
  }

  getDocument(): string {
    return this.document;
  }

  private splitByNewLine(): LineFormatter[] {
    const result: LineFormatter[] = [];
    let texts: TypedText[] = [];
    for (const typedText of this.typedTexts) {
      const type = typedText.type;
      let residualText = typedText.text;

      let idx: number;
      while ((idx = residualText.indexOf('\n')) !== -1) {
        // str.slice(0,0)は空文字列を返す。
        texts.push({text: residualText.slice(0, idx), type: type});
        result.push(new LineFormatter(texts));
        texts = [];
        // str.slice(length)は空文字列を返す。
        residualText = residualText.slice(idx+1);
      }
      texts.push({text: residualText, type: type});
    }
    return result;
  }

  private format(): string {
    let result = '';
    let newLineNum = 0;
    for (let i = 0; i < this.lineFormatters.length - 1; i++) {
      const lineFormatter = this.lineFormatters[i];
      const nextLineFormatter = this.lineFormatters[i+1];

      let addStr = lineFormatter.getAppendComment(nextLineFormatter);
      if (!addStr.includes('\n')) {
        newLineNum += 1;
      } else {
        addStr += '\n'.repeat(newLineNum);
        newLineNum = 0;
      }
      result += addStr;
    }

    // 最終行のコメント
    result += this.lineFormatters.slice(-1)[0].getComment();
    return result;
  }
}


// ======================================================================
export function preprocessSourceCode(sourceCode: string, lang: ProgramLang): string {
  const comments: Comment[] = [
    new Comment('//', '\n'),
    new Comment('/*', '*/'),
  ];
  const analyzer = new SourceCodeAnalyzer(comments);
  const typedTexts: TypedText[] = analyzer.type(sourceCode);
  const formatter = new CommentFormatter(typedTexts);
  const document = formatter.getDocument();

  return document;
}
