import {SetString, TextTypeChanger, Comment, StringLiteral} from './sourceCodeAnalyzer';

export type ProgramLangName = 'JavaScript or TypeScript' | 'C or C++' | 'Python' | 'Shell' | 'Custom'


// ======================================================================
export class ProgramLang {
  private readonly name: ProgramLangName;
  private lineComments: string[];
  private blockComments: SetString[];
  private stringLiterals: SetString[];

  constructor(name: ProgramLangName, lineComments: string[], blockComments: SetString[], stringLiterals: SetString[]) {
    this.name = name;
    this.lineComments = lineComments;
    this.blockComments = blockComments;
    this.stringLiterals = stringLiterals;
  }

  getName(): ProgramLangName {
    return this.name;
  }

  getLineComments(): string[] {
    return this.lineComments;
  }

  setLineComments(lineComments: string[]): void {
    this.lineComments = lineComments;
  }

  getBlockComments(): SetString[] {
    return this.blockComments;
  }

  setBlockComments(blockComments: SetString[]): void {
    this.blockComments = blockComments;
  }

  getStringLeterals(): SetString[] {
    return this.stringLiterals;
  }

  setStringLeterals(stringLiterals: SetString[]): void {
    this.stringLiterals = stringLiterals;
  }

  getTextTypeChangers(): TextTypeChanger[] {
    const changers: TextTypeChanger[] = [];
    changers.push(...this.lineComments.map(str => new Comment(str, '\n')));
    changers.push(...this.blockComments.map(obj => new Comment(obj.start, obj.end)));
    changers.push(...this.stringLiterals.map(obj => new StringLiteral(obj.start, obj.end)));
    return changers;
  }
}


// ======================================================================
export class ProgramLangsContainer {
  private readonly langs: ProgramLang[] = [
    new ProgramLang('JavaScript or TypeScript', ['//'], [{start: '/*', end: '*/'}], [{start: '\'', end: '\''}, {start: '"', end: '"'}, {start: '`', end: '`'}]),
    new ProgramLang('C or C++', ['//'], [{start: '/*', end: '*/'}], [{start: '\'', end: '\''}, {start: '"', end: '"'}]),
    new ProgramLang('Python', ['#'], [{start: '"""', end: '"""'}, {start: '\'\'\'', end: '\'\'\''}], [{start: '\'', end: '\''}, {start: '"', end: '"'}]),
    new ProgramLang('Shell', ['#'], [], [{start: '\'', end: '\''}, {start: '"', end: '"'}, {start: '`', end: '`'}]),
    new ProgramLang('Custom', [], [], []),
  ]

  getLangs(): ProgramLang[] {
    return this.langs;
  }

  name2lang(name: ProgramLangName): ProgramLang {
    const langs: ProgramLang[] = this.langs.filter(conf => conf.getName() === name);
    return langs[0];
  }
}
