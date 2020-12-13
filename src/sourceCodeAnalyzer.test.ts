import {TypedText, Comment, SourceCodeAnalyzer} from './sourceCodeAnalyzer';

// ======================================================================
let analyzer: SourceCodeAnalyzer;
beforeEach(() => {
  // setup
  const comment = new Comment('//', '\n');
  analyzer = new SourceCodeAnalyzer(comment);
});


// ======================================================================
test('ソースコード1行の場合', () => {
  const sourceCode = 'const a = 1 + 1;';
  const expectOutput: TypedText[] = [{text: 'const a = 1 + 1;', type: 'source'}];
  const result = analyzer.type(sourceCode);
  expect(result).toEqual(expectOutput);
});

test('コメント1行の場合', () => {
  const sourceCode = '// const a = 1 + 1;';
  const expectOutput: TypedText[] = [
    {text: '// ', type: 'typeChanger'},
    {text: 'const a = 1 + 1;', type: 'comment'},
  ];
  expect(analyzer.type(sourceCode)).toEqual(expectOutput);
});

test('ソースコードとコメントで全1行の場合', () => {
  const sourceCode = 'const a = 1 + 1;  // result: 2';
  const expectOutput: TypedText[] = [
    {text: 'const a = 1 + 1;', type: 'source'},
    {text: '  // ', type: 'typeChanger'},
    {text: 'result: 2', type: 'comment'},
  ];
  expect(analyzer.type(sourceCode)).toEqual(expectOutput);
});

test('ソースコード1行とコメント1行で全2行の場合', () => {
  const sourceCode = 'const a = 1 + 1;\n// result: 2';
  const expectOutput: TypedText[] = [
    {text: 'const a = 1 + 1;\n', type: 'source'},
    {text: '// ', type: 'typeChanger'},
    {text: 'result: 2', type: 'comment'},
  ];
  expect(analyzer.type(sourceCode)).toEqual(expectOutput);
});

test('コメント1行とソースコード1行で全2行の場合', () => {
  const sourceCode = '// result: 2\nconst a = 1 + 1;';
  const expectOutput: TypedText[] = [
    {text: '// ', type: 'typeChanger'},
    {text: 'result: 2', type: 'comment'},
    {text: '\n', type: 'typeChanger'},
    {text: 'const a = 1 + 1;', type: 'source'},
  ];
  expect(analyzer.type(sourceCode)).toEqual(expectOutput);
});
