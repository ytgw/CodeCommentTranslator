type LineComment = string
type BlockComment = {start: string, end: string}
type ProgramLangName = 'JavaScript or TypeScript' | 'C or C++' | 'Python' | 'Shell'


// ======================================================================
export class ProgramLangConfig {
  private name: ProgramLangName;
  private lineComment: LineComment;
  private blockComment: {start: string, end: string};

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
function name2config(name: ProgramLangName): ProgramLangConfig {
  let langConfig: ProgramLangConfig;
  switch (name) {
  case 'JavaScript or TypeScript':
    langConfig = new ProgramLangConfig(name, '//', {start: '/*', end: '*/'});
    break;
  case 'C or C++':
    langConfig = new ProgramLangConfig(name, '//', {start: '/*', end: '*/'});
    break;
  case 'Python':
    langConfig = new ProgramLangConfig(name, '#', {start: '/*', end: '*/'});
    break;
  case 'Shell':
    langConfig = new ProgramLangConfig(name, '#', {start: '', end: ''});
    break;
  }
  return langConfig;
}

export const programLangs: ProgramLangConfig[] = [
  name2config('JavaScript or TypeScript'),
  name2config('C or C++'),
  name2config('Python'),
  name2config('Shell'),
];
