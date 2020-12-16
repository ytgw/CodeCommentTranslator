import React from 'react';
import {ProgramLang, ProgramLangsContainer, ProgramLangName} from './programmingLanguage';
import {preprocessSourceCode} from './preprocess';
import {SourceInput, PreProcessButton, PreProcessResult, TranslatorButton} from './appMainComponents';
import './index.css';

type Empty = Record<string, never>


// ======================================================================
type AppState = {
  lang: ProgramLang,
}

export class App extends React.Component<Empty, AppState> {
  private readonly langsContainer: ProgramLangsContainer = new ProgramLangsContainer();

  constructor(props: Empty) {
    super(props);
    this.state = {
      lang: this.langsContainer.getLangs()[0]
    };
  }

  onLangChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    this.setState({
      lang: this.langsContainer.name2lang(event.target.value as ProgramLangName)
    });
  }

  render(): JSX.Element {
    return (
      <>
        <CommentConfig
          lang={this.state.lang}
          langsContainer={this.langsContainer}
          isCustomLang={this.state.lang.getName() === 'Custom'}
          onLangChange={this.onLangChange}
        />
        <AppMain lang={this.state.lang}/>
      </>
    );
  }
}


// ======================================================================
type CommentConfigProps = {
  lang: ProgramLang,
  langsContainer: ProgramLangsContainer,
  isCustomLang: boolean,
  onLangChange: (event: React.ChangeEvent<HTMLSelectElement>) => void,
}

type CommentConfigState = {
  lineComments: string[],
  blockComments: {start: string, end: string}[],
}

class CommentConfig extends React.Component<CommentConfigProps, CommentConfigState> {
  constructor(props: CommentConfigProps) {
    super(props);
    this.state = {
      lineComments: [],
      blockComments: [],
    };
  }

  lang2optionElement = (lang: ProgramLang): JSX.Element => {
    const name = lang.getName();
    return (
      <option value={name} key={name}>{name}</option>
    );
  }

  renderSelectLang(): JSX.Element {
    return (
      <select value={this.props.lang.getName()} onChange={this.props.onLangChange}>
        {this.props.langsContainer.getLangs().map(this.lang2optionElement)}
      </select>
    );
  }

  renderNormalComment(): JSX.Element {
    const lineComments = this.props.lang.getLineComments();
    const blockComments = this.props.lang.getBlockComments();
    return (
      <>
        ラインコメント：{lineComments.map(str => `「${str}」`).join(', ')}
        <br />
        ブロックコメント：{blockComments.map(obj => `「${obj.start}〜${obj.end}」`).join(', ')}
      </>
    );
  }

  renderCustomCommentForms(str: string, inputNum: number, onChange: (comment: string, commentIdx: number) => void): JSX.Element {
    const children: (string | JSX.Element)[] = [str];
    for (let i = 0; i < inputNum; i++) {
      children.push(
        <input type="text" value={this.state.lineComments[i]} onChange={(e): void => onChange(e.target.value, i)} key={i} />
      );
    }
    return <label>{children}</label>;
  }

  onLineCommentsChange(comment: string, commentIdx: number): void {
    const lineComments = this.state.lineComments;
    if (commentIdx < lineComments.length) {
      lineComments[commentIdx] = comment;
    } else {
      lineComments.push(comment);
    }
    this.setState({lineComments: lineComments});
  }

  renderCustomLineComment(): JSX.Element {
    const lineComments = this.state.lineComments;
    const inputElements: (string | JSX.Element)[] = ['ラインコメント：「'];
    for (let i = 0; i <= lineComments.length; i++) {
      const value = (i === lineComments.length) ? '' : lineComments[i];
      inputElements.push(
        <input
          type="text"
          value={value}
          onChange={(e): void => this.onLineCommentsChange(e.target.value, i)}
          key={'lineComment' + i.toString()}
        />
      );
      inputElements.push('」、');
    }
    return <>{inputElements}</>;
  }

  onBlockCommentsChange(comment: string, commentIdx: number, isStart: boolean): void {
    const blockComments = this.state.blockComments;
    let start: string;
    let end: string;
    if (commentIdx < blockComments.length) {
      start = isStart ? comment : blockComments[commentIdx].start;
      end = !isStart ? comment : blockComments[commentIdx].end;
      blockComments[commentIdx] = {start, end};
    } else {
      start = isStart ? comment : '';
      end = !isStart ? comment : '';
      blockComments.push({start, end});
    }
    this.setState({blockComments: blockComments});
  }

  renderCustomBineComment(): JSX.Element {
    const blockComments = this.state.blockComments;
    const inputElements: (string | JSX.Element)[] = ['ブロックコメント：「'];
    for (let i = 0; i <= blockComments.length; i++) {
      const value = (i === blockComments.length) ? {start: '', end: ''} : blockComments[i];
      inputElements.push(
        <input
          type="text"
          value={value.start}
          onChange={(e): void => this.onBlockCommentsChange(e.target.value, i, true)}
          key={'blockComment' + i.toString()}
        />
      );
      inputElements.push('〜');
      inputElements.push(
        <input
          type="text"
          value={value.end}
          onChange={(e): void => this.onBlockCommentsChange(e.target.value, i, false)}
          key={i}
        />
      );
      inputElements.push('」、');
    }
    return <>{inputElements}</>;
  }

  onSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (this.props.isCustomLang) {
      this.props.lang.setLineComments(this.state.lineComments);
      this.props.lang.setBlockComments(this.state.blockComments);
    }

    const messages: string[] = [
      'Customプログラム言語のコメント設定が反映されました。',
      'ラインコメント：「' + this.props.lang.getLineComments().join('」、「') + '」',
      'ブロックコメント：' + this.props.lang.getBlockComments().map(v => `「${v.start}〜${v.end}」`).join('、'),
    ];
    alert(messages.join('\n'));
  }

  renderCustomComment(): JSX.Element {
    return (
      <form onSubmit={(e): void => this.onSubmit(e)}>
        {this.renderCustomLineComment()}
        <br />
        {this.renderCustomBineComment()}
        <br />
        <input type="submit" value="Submit" className="Submit" />
      </form>
    );
  }

  render(): JSX.Element {
    const commentElement = this.props.isCustomLang ? this.renderCustomComment() : this.renderNormalComment();
    return (
      <div className="CommentConfig">
        プログラミング言語：{this.renderSelectLang()}
        <br />
        {commentElement}
      </div>
    );
  }
}


// ======================================================================
type AppMainProps = {
  lang: ProgramLang,
}

type AppMainState = {
  sourceInput: string,
  preProcessResult: string,
  translationResult: string,
  shouldPreProcessed: boolean,
  shouldTranslated: boolean,
}

class AppMain extends React.Component<AppMainProps, AppMainState> {
  constructor(props: AppMainProps) {
    super(props);
    this.state = {
      sourceInput: '',
      preProcessResult: '',
      translationResult: '',
      shouldPreProcessed: false,
      shouldTranslated: false,
    };
  }

  onSourceInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    this.setState({
      sourceInput: event.target.value,
      shouldPreProcessed: true,
    });
  }

  onPreProcessButtonClick = (): void => {
    this.setState({
      preProcessResult: preprocessSourceCode(this.state.sourceInput, this.props.lang),
      shouldPreProcessed: false,
      shouldTranslated: true,
    });
  }

  onPreProcessResultChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    this.setState({
      preProcessResult: event.target.value,
      shouldTranslated: true,
    });
  }

  onTranslatorButtonClick = (): void => {
    this.setState({
      translationResult: 'Generate From PreProcessResult\n-----\n' + this.state.preProcessResult,
      shouldTranslated: false,
    });
    const url = 'https://www.deepl.com/translator#en/ja/' + encodeURI(this.state.preProcessResult.replace(/\n{2,}/g, '\n\n'));
    window.open(url, '_blank');
  }

  render(): JSX.Element {
    return (
      <div className="AppMain">
        <div className="AppMainForm">
          <span>ソースコード入力フォーム</span>
          <br />
          <SourceInput value={this.state.sourceInput} onChange={this.onSourceInputChange} />
        </div>
        <div className="AppMainButton">
          <PreProcessButton isHighlight={this.state.shouldPreProcessed} onClick={this.onPreProcessButtonClick} />
        </div>
        <div className="AppMainForm">
          <span>前処理結果</span>
          <br />
          <PreProcessResult result={this.state.preProcessResult} onChange={this.onPreProcessResultChange} />
        </div>
        <div className="AppMainButton">
          <TranslatorButton isHighlight={this.state.shouldTranslated} onClick={this.onTranslatorButtonClick} />
        </div>
        {/* <div className="AppMainForm">
          <span>翻訳結果</span>
          <br />
          <TranslationResult result={this.state.translationResult} />
        </div> */}
      </div>
    );
  }
}
