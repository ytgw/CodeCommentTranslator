import {ProgramLang} from './programmingLanguage';

export function preprocessSourceCode(sourceCode: string, lang: ProgramLang): string {
  let preProcessResult = 'Generate From sourceCode';
  preProcessResult += '\n-----\n';
  preProcessResult += lang.getName();
  preProcessResult += '\n-----\n';
  preProcessResult += sourceCode;

  return preProcessResult;
}
