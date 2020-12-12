import fs from 'fs';
import {preprocessSourceCode} from './preprocess';
import {ProgramLangsContainer, ProgramLang} from './programmingLanguage';


// ======================================================================
let lang: ProgramLang;
beforeEach(() => {
  // setup
  lang = (new ProgramLangsContainer).name2lang('JavaScript or TypeScript');
});


// ======================================================================
test('TypeScript_ラインコメントから始まる行', () => {
  // 末尾の改行の有無の違いを無視するため、変換後のHTMLのスペースをtrimメソッドで削除してから比較
  const sampleInput  = fs.readFileSync('./src/testSample/sample_TypeScript_ラインコメントから始まる行.txt', { encoding: 'utf8' }).trimEnd();
  const expectOutput = fs.readFileSync('./src/testSample/expect_TypeScript_ラインコメントから始まる行.txt', { encoding: 'utf8' }).trimEnd();
  const result = preprocessSourceCode(sampleInput, lang).trimEnd();

  expect(result).toEqual(expectOutput);
});

test('TypeScript_ラインコメントから始まる行が連続', () => {
  const sampleInput  = fs.readFileSync('./src/testSample/sample_TypeScript_ラインコメントから始まる行が連続.txt', { encoding: 'utf8' }).trimEnd();
  const expectOutput = fs.readFileSync('./src/testSample/expect_TypeScript_ラインコメントから始まる行が連続.txt', { encoding: 'utf8' }).trimEnd();
  expect(preprocessSourceCode(sampleInput, lang).trimEnd()).toEqual(expectOutput);
});

test('TypeScript_ソースコードの後にラインコメント', () => {
  const sampleInput  = fs.readFileSync('./src/testSample/sample_TypeScript_ソースコードの後にラインコメント.txt', { encoding: 'utf8' }).trimEnd();
  const expectOutput = fs.readFileSync('./src/testSample/expect_TypeScript_ソースコードの後にラインコメント.txt', { encoding: 'utf8' }).trimEnd();
  expect(preprocessSourceCode(sampleInput, lang).trimEnd()).toEqual(expectOutput);
});

test('TypeScript_ラインコメントのみの行が連続し末尾がハイフン', () => {
  const sampleInput  = fs.readFileSync('./src/testSample/sample_TypeScript_ラインコメントのみの行が連続し末尾がハイフン.txt', { encoding: 'utf8' }).trimEnd();
  const expectOutput = fs.readFileSync('./src/testSample/expect_TypeScript_ラインコメントのみの行が連続し末尾がハイフン.txt', { encoding: 'utf8' }).trimEnd();
  expect(preprocessSourceCode(sampleInput, lang).trimEnd()).toEqual(expectOutput);
});

test('TypeScript_ブロックコメントから始まる行', () => {
  const sampleInput  = fs.readFileSync('./src/testSample/sample_TypeScript_ブロックコメントから始まる行.txt', { encoding: 'utf8' }).trimEnd();
  const expectOutput = fs.readFileSync('./src/testSample/expect_TypeScript_ブロックコメントから始まる行.txt', { encoding: 'utf8' }).trimEnd();
  expect(preprocessSourceCode(sampleInput, lang).trimEnd()).toEqual(expectOutput);
});

test('TypeScript_複数行のブロックコメント', () => {
  const sampleInput  = fs.readFileSync('./src/testSample/sample_TypeScript_複数行のブロックコメント.txt', { encoding: 'utf8' }).trimEnd();
  const expectOutput = fs.readFileSync('./src/testSample/expect_TypeScript_複数行のブロックコメント.txt', { encoding: 'utf8' }).trimEnd();
  expect(preprocessSourceCode(sampleInput, lang).trimEnd()).toEqual(expectOutput);
});
