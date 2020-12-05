type LineComment = string
type BlockComment = {start: string, end: string}
export type ProgramLangName = 'JavaScript or TypeScript' | 'C or C++' | 'Python' | 'Shell'


// ======================================================================
export class ProgramLang {
  private readonly name: ProgramLangName;
  private readonly lineComment: LineComment;
  private readonly blockComment: {start: string, end: string};

  constructor(name: ProgramLangName, lineComment: LineComment, blockComment: BlockComment) {
    this.name = name;
    this.lineComment = lineComment;
    this.blockComment = blockComment;
  }

  getName(): ProgramLangName {
    return this.name;
  }

  getLineComment(): LineComment {
    return this.lineComment;
  }

  getBlockComment(): BlockComment {
    return this.blockComment;
  }
}


// ======================================================================
export class ProgramLangsContainer {
  private readonly langs: ProgramLang[] = [
    new ProgramLang('JavaScript or TypeScript', '//', {start: '/*', end: '*/'}),
    new ProgramLang('C or C++', '//', {start: '/*', end: '*/'}),
    new ProgramLang('Python', '#', {start: '"""', end: '"""'}),
    new ProgramLang('Shell', '#', {start: '', end: ''}),
  ]

  getLangs(): ProgramLang[] {
    return this.langs;
  }

  name2lang(name: ProgramLangName): ProgramLang {
    const langs: ProgramLang[] = this.langs.filter(conf => conf.getName() === name);
    return langs[0];
  }
}
