import React from 'react';
import {ProgramLang, ProgramLangsContainer, ProgramLangName} from './programmingLanguage';
import {SourceInput, PreProcessButton, PreProcessResult, TranslatorButton, TranslationResult} from './appMainComponents';
import './index.css';


// ======================================================================
type AppState = {
  lang: ProgramLang
}

export class App extends React.Component<Empty, AppState> {
  private readonly langsContainer: ProgramLangsContainer = new ProgramLangsContainer();

  constructor(props: Empty) {
    super(props);
    this.state = {
      lang: this.langsContainer.getLangs()[0]
    };
  }

  render(): JSX.Element {
    return (
      <>
        <CommentConfig lang={this.state.lang} langsContainer={this.langsContainer} />
        <AppMain />
      </>
    );
  }
}


// ======================================================================
type CommentConfigProps = {
  lang: ProgramLang
  langsContainer: ProgramLangsContainer
}

class CommentConfig extends React.Component<CommentConfigProps> {
  lang2optionElement = (lang: ProgramLang): JSX.Element => {
    const name = lang.getName();
    return (
      <option value={name} key={name}>{name}</option>
    );
  }

  renderSelectLang(): JSX.Element {
    return (
      <select value={this.props.lang.getName()} onChange={this.onLangChange}>
        {this.props.langsContainer.getLangs().map(this.lang2optionElement)}
      </select>
    );
  }

  onLangChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    this.setState({
      lang: this.props.langsContainer.name2lang(event.target.value as ProgramLangName)
    });
  }

  render(): JSX.Element {
    return (
      <div className="CommentConfig">
        プログラミング言語：{this.renderSelectLang()}
        <br />
        ラインコメント：「{this.props.lang.getLineComment()}」
        <br />
        ブロックコメント：「{this.props.lang.getBlockComment().start}」~「{this.props.lang.getBlockComment().end}」
      </div>
    );
  }
}


// ======================================================================
type Empty = Record<string, never>

type AppMainState = {
  sourceInput: string,
  preProcessResult: string,
  translationResult: string,
  shouldPreProcessed: boolean,
  shouldTranslated: boolean,
}

class AppMain extends React.Component<Empty, AppMainState> {
  constructor(props: Empty) {
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
      preProcessResult: 'Generate From SourceInput\n-----\n' + this.state.sourceInput,
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
        <div className="AppMainForm">
          <span>翻訳結果</span>
          <br />
          <TranslationResult result={this.state.translationResult} />
        </div>
      </div>
    );
  }
}
