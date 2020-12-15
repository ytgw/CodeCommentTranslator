type LineComment = string
type BlockComment = {start: string, end: string}
import {Comment} from './sourceCodeAnalyzer';
export type ProgramLangName = 'JavaScript or TypeScript' | 'C or C++' | 'Python' | 'Shell'


// ======================================================================
export class ProgramLang {
  private readonly name: ProgramLangName;
  private readonly lineComments: LineComment[];
  private readonly blockComments: {start: string, end: string}[];
  private readonly comments: Comment[];

  constructor(name: ProgramLangName, lineComments: LineComment[], blockComments: BlockComment[]) {
    this.name = name;
    this.lineComments = lineComments;
    this.blockComments = blockComments;

    const comments: Comment[] = [];
    comments.push(...lineComments.map(str => new Comment(str, '\n')));
    comments.push(...blockComments.map(obj => new Comment(obj.start, obj.end)));
    this.comments = comments;
  }

  getName(): ProgramLangName {
    return this.name;
  }

  getLineComment(): LineComment {
    return this.lineComments[0];
  }

  getBlockComment(): BlockComment {
    return this.blockComments[0];
  }

  getCommens(): Comment[] {
    return this.comments;
  }
}


// ======================================================================
export class ProgramLangsContainer {
  private readonly langs: ProgramLang[] = [
    new ProgramLang('JavaScript or TypeScript', ['//'], [{start: '/*', end: '*/'}]),
    new ProgramLang('C or C++', ['//'], [{start: '/*', end: '*/'}]),
    new ProgramLang('Python', ['#'], [{start: '"""', end: '"""'}, {start: '\'\'\'', end: '\'\'\''}]),
    new ProgramLang('Shell', ['#'], []),
  ]

  getLangs(): ProgramLang[] {
    return this.langs;
  }

  name2lang(name: ProgramLangName): ProgramLang {
    const langs: ProgramLang[] = this.langs.filter(conf => conf.getName() === name);
    return langs[0];
  }
}
