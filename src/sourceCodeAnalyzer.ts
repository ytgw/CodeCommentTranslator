type TextType = 'source' | 'typeChanger' | 'comment' | 'stringLiteral'

export interface TypedText {
  text: string,
  type: TextType,
}

export interface Analyzer {
  type: (sourceCode: string) => TypedText[],
}

export interface TextTypeChanger {
  startPattern: string,
  endPattern: string,
  type: TextType,
}

type NextInfo = {isInSrc: true, changer: undefined} | {isInSrc: false, changer: TextTypeChanger};


// ======================================================================
export class Comment implements TextTypeChanger {
  readonly startPattern: string;
  readonly endPattern: string;
  readonly type: TextType;

  constructor(start: string, end: string) {
    this.startPattern = this.toPattern(start);
    this.endPattern = this.toPattern(end);
    this.type = 'comment';
  }

  private toPattern(str: string): string {
    return str.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
  }
}

// ======================================================================
export class SourceCodeAnalyzer implements Analyzer {
  private typedTexts: TypedText[];
  private nextInfo: NextInfo;
  private hasResidual: boolean;
  private residualText: string;
  private readonly typeChangers: TextTypeChanger[];

  constructor(typeChangers: TextTypeChanger[]) {
    this.typedTexts = [];
    this.nextInfo = {isInSrc: true, changer: undefined};
    this.hasResidual = true;
    this.residualText = '';
    this.typeChangers = typeChangers;
  }

  type(sourceCode: string): TypedText[] {
    const nextInfo: NextInfo = {isInSrc: true, changer: undefined};
    this.setState([], nextInfo, true, sourceCode);
    while (this.hasResidual) {
      const sourceCode = this.residualText;
      const info: NextInfo = this.nextInfo;
      const pattern = this.getPattern();
      this.typeFromPattern(sourceCode, pattern, info);
    }

    return this.typedTexts;
  }

  private getPattern(): string {
    // 変化文字の前後に0個以上の改行を除くスペースライク文字があるパターン。
    const spacePattern = '[^\\S\\n]*';
    let pattern: string;
    if (this.nextInfo.changer === undefined) {
      pattern = this.typeChangers.map(
        changer => `(${spacePattern}${changer.startPattern}${spacePattern})`
      ).join('|');
    } else {
      pattern = spacePattern + this.nextInfo.changer.endPattern + spacePattern;
    }

    return pattern;
  }

  private setState(typedTexts: TypedText[], nextInfo: NextInfo, hasResidual: boolean, residualText: string): void {
    this.typedTexts = typedTexts;
    this.nextInfo = nextInfo;
    this.hasResidual = hasResidual;
    this.residualText = residualText;
  }

  private typeFromPattern(sourceCode: string, pattern: string, info: NextInfo): void {
    const firstType: TextType = info.isInSrc ? 'source' : info.changer.type;
    const regex = new RegExp(pattern);
    const array = regex.exec(sourceCode);

    let addTypedTexts: TypedText[];
    let nextInfo: NextInfo;
    let hasResidual: boolean;
    let residualText: string;
    if (array === null) {
      addTypedTexts = [{text: sourceCode, type: firstType}];
      nextInfo = info;
      hasResidual = false;
      residualText = '';
    } else {
      const sidx = array.index;
      const eidx = array.index + array[0].length;
      addTypedTexts = [
        {text: sourceCode.slice(0, sidx), type: firstType},
        {text: sourceCode.slice(sidx, eidx), type: 'typeChanger'},
      ];
      addTypedTexts = addTypedTexts.filter(p => p.text !== '');
      if (info.isInSrc) {
        nextInfo = {isInSrc: false, changer: this.startPattern2typeChanger(array[0])};
      } else {
        nextInfo = {isInSrc: true, changer: undefined};
      }
      hasResidual = (eidx < sourceCode.length);
      residualText = sourceCode.slice(eidx, sourceCode.length);
    }

    const typedTexts = this.typedTexts.concat(addTypedTexts);
    this.setState(typedTexts, nextInfo, hasResidual, residualText);
  }

  private startPattern2typeChanger(str: string): TextTypeChanger {
    for (const changer of this.typeChangers) {
      const pattern = changer.startPattern;
      const regex = new RegExp(pattern);
      if (regex.test(str)) {
        return changer;
      }
    }
    throw new Error('パターンが見つかりません。');
  }
}
