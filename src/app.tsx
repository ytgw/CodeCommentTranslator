import React from 'react';
import {ProgramLang, ProgramLangsContainer, ProgramLangName} from './programmingLanguage';
import {SourceInput, PreProcessButton, PreProcessResult, TranslatorButton, TranslationResult} from './appMainComponents';
import './index.css';


// ======================================================================
export class App extends React.Component {
  render(): JSX.Element {
    return (
      <>
        <CommentConfig />
        <AppMain />
      </>
    );
  }
}


// ======================================================================
class CommentConfig extends React.Component<Empty, {lang: ProgramLang}> {
  private readonly langsContainer: ProgramLangsContainer = new ProgramLangsContainer();

  constructor(props: Empty) {
    super(props);
    this.state = {
      lang: this.langsContainer.getLangs()[0]
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
      <select value={this.state.lang.getName()} onChange={this.onLangChange}>
        {this.langsContainer.getLangs().map(this.lang2optionElement)}
      </select>
    );
  }

  onLangChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    this.setState({
      lang: this.langsContainer.name2lang(event.target.value as ProgramLangName)
    });
  }

  render(): JSX.Element {
    return (
      <div className="CommentConfig">
        プログラミング言語：{this.renderSelectLang()}
        <br />
        ラインコメント：「{this.state.lang.getLineComment()}」
        <br />
        ブロックコメント：「{this.state.lang.getBlockComment().start}」~「{this.state.lang.getBlockComment().end}」
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
