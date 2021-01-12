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
  const sampleInput  = fs.readFileSync('./src/testSample/sample_TypeScript_ラインコメントから始まる行.txt', {encoding: 'utf8'});
  const expectOutput = fs.readFileSync('./src/testSample/expect_TypeScript_ラインコメントから始まる行.txt', {encoding: 'utf8'});
  const result = preprocessSourceCode(sampleInput, lang);

  expect(result.trimEnd()).toEqual(expectOutput.trimEnd());
});

test('TypeScript_ラインコメントから始まる行が連続', () => {
  const sampleInput  = fs.readFileSync('./src/testSample/sample_TypeScript_ラインコメントから始まる行が連続.txt', {encoding: 'utf8'});
  const expectOutput = fs.readFileSync('./src/testSample/expect_TypeScript_ラインコメントから始まる行が連続.txt', {encoding: 'utf8'});
  expect(preprocessSourceCode(sampleInput, lang).trimEnd()).toEqual(expectOutput.trimEnd());
});

test('TypeScript_ソースコードの後にラインコメント', () => {
  const sampleInput  = fs.readFileSync('./src/testSample/sample_TypeScript_ソースコードの後にラインコメント.txt', {encoding: 'utf8'});
  const expectOutput = fs.readFileSync('./src/testSample/expect_TypeScript_ソースコードの後にラインコメント.txt', {encoding: 'utf8'});
  expect(preprocessSourceCode(sampleInput, lang).trimEnd()).toEqual(expectOutput.trimEnd());
});

test('TypeScript_ラインコメントのみの行が連続し末尾がハイフン', () => {
  const sampleInput  = fs.readFileSync('./src/testSample/sample_TypeScript_ラインコメントのみの行が連続し末尾がハイフン.txt', {encoding: 'utf8'});
  const expectOutput = fs.readFileSync('./src/testSample/expect_TypeScript_ラインコメントのみの行が連続し末尾がハイフン.txt', {encoding: 'utf8'});
  expect(preprocessSourceCode(sampleInput, lang).trimEnd()).toEqual(expectOutput.trimEnd());
});


// ======================================================================
test('TypeScript_ブロックコメントから始まる行', () => {
  const sampleInput  = fs.readFileSync('./src/testSample/sample_TypeScript_ブロックコメントから始まる行.txt', {encoding: 'utf8'});
  const expectOutput = fs.readFileSync('./src/testSample/expect_TypeScript_ブロックコメントから始まる行.txt', {encoding: 'utf8'});
  expect(preprocessSourceCode(sampleInput, lang).trimEnd()).toEqual(expectOutput.trimEnd());
});

test('TypeScript_複数行のブロックコメント', () => {
  const sampleInput  = fs.readFileSync('./src/testSample/sample_TypeScript_複数行のブロックコメント.txt', {encoding: 'utf8'});
  const expectOutput = fs.readFileSync('./src/testSample/expect_TypeScript_複数行のブロックコメント.txt', {encoding: 'utf8'});
  expect(preprocessSourceCode(sampleInput, lang).trimEnd()).toEqual(expectOutput.trimEnd());
});

test('TypeScript_ソースコードの途中にブロックコメント', () => {
  const sampleInput  = fs.readFileSync('./src/testSample/sample_TypeScript_ソースコードの途中にブロックコメント.txt', {encoding: 'utf8'});
  const expectOutput = fs.readFileSync('./src/testSample/expect_TypeScript_ソースコードの途中にブロックコメント.txt', {encoding: 'utf8'});
  expect(preprocessSourceCode(sampleInput, lang).trimEnd()).toEqual(expectOutput.trimEnd());
});


// ======================================================================
test('JavaScript_Nodejsのutilの抜粋', () => {
  const sampleInput  = fs.readFileSync('./src/testSample/sample_Javascript_nodejs_util_抜粋.txt', {encoding: 'utf8'});
  const expectOutput = fs.readFileSync('./src/testSample/expect_Javascript_nodejs_util_抜粋.txt', {encoding: 'utf8'});
  expect(preprocessSourceCode(sampleInput, lang).trimEnd()).toEqual(expectOutput.trimEnd());
});

test('JavaScript_Nodejsのutil', () => {
  const sampleInput  = fs.readFileSync('./src/testSample/sample_Javascript_nodejs_util.txt', {encoding: 'utf8'});
  const expectOutput = fs.readFileSync('./src/testSample/expect_Javascript_nodejs_util.txt', {encoding: 'utf8'});
  expect(preprocessSourceCode(sampleInput, lang).trimEnd()).toEqual(expectOutput.trimEnd());
});


// ======================================================================
test('https://github.com/ytgw/CodeCommentTranslator/issues/1', () => {
  lang = (new ProgramLangsContainer).name2lang('C or C++');
  const sampleInput  = '//{ 29, ""}, /* Sami*/';
  const expectOutput = '{ 29, ""}, /* Sami*/';
  expect(preprocessSourceCode(sampleInput, lang).trimEnd()).toEqual(expectOutput.trimEnd());
});
