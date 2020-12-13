type TextType = 'source' | 'typeChanger' | 'comment'

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
  private isNextInSrc: boolean;
  private hasResidual: boolean;
  private residualText: string;
  private readonly typeChanger: TextTypeChanger;

  constructor(typeChanger: TextTypeChanger) {
    this.typedTexts = [];
    this.isNextInSrc = true;
    this.hasResidual = true;
    this.residualText = '';
    this.typeChanger = typeChanger;
  }

  type(sourceCode: string): TypedText[] {
    this.setState([], true, true, sourceCode);
    while (this.hasResidual) {
      const sourceCode = this.residualText;
      const startsInSrc = this.isNextInSrc;
      const typeChanger = this.typeChanger;

      // 変化文字の前後に0個以上の改行を除くスペースライク文字があるパターン。
      const spacePattern = '[^\\S\\n]*';
      const pattern = startsInSrc
        ? spacePattern + typeChanger.startPattern + spacePattern
        : spacePattern + typeChanger.endPattern + spacePattern;

      this.typeFromPattern(sourceCode, typeChanger, pattern, startsInSrc);
    }

    return this.typedTexts;
  }

  private setState(typedTexts: TypedText[], isNextInSrc: boolean, hasResidual: boolean, residualText: string): void {
    this.typedTexts = typedTexts;
    this.isNextInSrc = isNextInSrc;
    this.hasResidual = hasResidual;
    this.residualText = residualText;
  }

  private typeFromPattern(sourceCode: string, typeChanger: TextTypeChanger, pattern: string, startsInSrc: boolean): void {
    const firstType: TextType = startsInSrc ? 'source' : typeChanger.type;
    const regex = new RegExp(pattern);
    const array = regex.exec(sourceCode);

    let addTypedTexts: TypedText[];
    let isNextInSrc: boolean;
    let hasResidual: boolean;
    let residualText: string;
    if (array === null) {
      addTypedTexts = [{text: sourceCode, type: firstType}];
      isNextInSrc = startsInSrc;
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
      isNextInSrc = !startsInSrc;
      hasResidual = (eidx < sourceCode.length);
      residualText = sourceCode.slice(eidx, sourceCode.length);
    }

    const typedTexts = this.typedTexts.concat(addTypedTexts);
    this.setState(typedTexts, isNextInSrc, hasResidual, residualText);
  }
}
