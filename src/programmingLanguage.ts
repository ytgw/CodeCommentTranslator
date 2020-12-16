import {Comment} from './sourceCodeAnalyzer';

type LineComment = string
type BlockComment = {start: string, end: string}
export type ProgramLangName = 'JavaScript or TypeScript' | 'C or C++' | 'Python' | 'Shell' | 'Custom'


// ======================================================================
export class ProgramLang {
  private readonly name: ProgramLangName;
  private lineComments: LineComment[];
  private blockComments: {start: string, end: string}[];

  constructor(name: ProgramLangName, lineComments: LineComment[], blockComments: BlockComment[]) {
    this.name = name;
    this.lineComments = lineComments;
    this.blockComments = blockComments;
  }

  getName(): ProgramLangName {
    return this.name;
  }

  getLineComments(): LineComment[] {
    return this.lineComments;
  }

  setLineComments(lineComments: LineComment[]): void {
    this.lineComments = lineComments;
  }

  getBlockComments(): BlockComment[] {
    return this.blockComments;
  }

  setBlockComments(blockComments: BlockComment[]): void {
    this.blockComments = blockComments;
  }

  getCommens(): Comment[] {
    const comments: Comment[] = [];
    comments.push(...this.lineComments.map(str => new Comment(str, '\n')));
    comments.push(...this.blockComments.map(obj => new Comment(obj.start, obj.end)));
    return comments;
  }
}


// ======================================================================
export class ProgramLangsContainer {
  private readonly langs: ProgramLang[] = [
    new ProgramLang('JavaScript or TypeScript', ['//'], [{start: '/*', end: '*/'}]),
    new ProgramLang('C or C++', ['//'], [{start: '/*', end: '*/'}]),
    new ProgramLang('Python', ['#'], [{start: '"""', end: '"""'}, {start: '\'\'\'', end: '\'\'\''}]),
    new ProgramLang('Shell', ['#'], []),
    new ProgramLang('Custom', [], []),
  ]

  getLangs(): ProgramLang[] {
    return this.langs;
  }

  name2lang(name: ProgramLangName): ProgramLang {
    const langs: ProgramLang[] = this.langs.filter(conf => conf.getName() === name);
    return langs[0];
  }
}
