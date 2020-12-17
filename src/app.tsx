import React from 'react';
import {ProgramLang} from './programmingLanguage';
import {preprocessSourceCode} from './preprocess';
import {SourceInput, PreProcessButton, PreProcessResult, TranslatorButton} from './appMainComponents';
import './index.css';


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

export class AppMain extends React.Component<AppMainProps, AppMainState> {
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
    if (this.props.lang.getTextTypeChangers().length === 0) {
      const message = 'ラインコメント、ブロックコメント、文字リテラルのいずれかを設定してください。';
      alert(message);
      return;
    }
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
