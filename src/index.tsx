import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// ======================================================================
function Top(): JSX.Element {
  return (
    <>
      <div><Title /><Manual /></div>
      <div><App /></div>
    </>
  );
}

function Title(): JSX.Element {
  return (<h1>Source Code Comment Translator</h1>);
}

function Manual(): JSX.Element {
  return (<div className="Manual">Manualは未実装</div>);
}


// ======================================================================
class App extends React.Component {
  render(): JSX.Element {
    return (
      <>
        <CommentConfig />
        <AppMain />
      </>
    );
  }
}

function CommentConfig(): JSX.Element {
  return (<div className="CommentConfig">CommentConfigは未実装</div>);
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
      preProcessResult: 'Generate From SourceInput --- ' + this.state.sourceInput,
      shouldPreProcessed: false,
    });
  }

  onPreProcessResultChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    this.setState({
      preProcessResult: event.target.value,
      shouldTranslated: true,
    });
  }

  render(): JSX.Element {
    return (
      <div className="AppMain">
        <div className="AppMainForm">
          <SourceInput value={this.state.sourceInput} onChange={this.onSourceInputChange} />
        </div>
        <div className="AppMainButton">
          <PreProcessButton isHighlight={this.state.shouldPreProcessed} onClick={this.onPreProcessButtonClick}/>
        </div>
        <div className="AppMainForm">
          <PreProcessResult result={this.state.preProcessResult} onChange={this.onPreProcessResultChange} />
        </div>
        <div className="AppMainButton">
          <TranslatorButton />
        </div>
        <div className="AppMainForm">
          <TranslationResult />
        </div>
      </div>
    );
  }
}


// ======================================================================
type SourceInputProps = {
  value: string,
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
}

function SourceInput(props: SourceInputProps): JSX.Element {
  return (
    <form>
      <textarea
        placeholder="翻訳したいソースコードを入力してください。"
        value={props.value}
        onChange={props.onChange}
      />
    </form>
  );
}


// ======================================================================
type PreProcessButtonProps = {
  isHighlight: boolean,
  onClick: () => void
}

function PreProcessButton(props: PreProcessButtonProps): JSX.Element {
  const style: React.CSSProperties = {
    backgroundColor: props.isHighlight ? '#ffeeee' : undefined,
  };

  return (
    <button style={style} onClick={props.onClick}>
      前処理
    </button>
  );
}


// ======================================================================
type PreProcessResultProps = {
  result: string
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
}

function PreProcessResult(props: PreProcessResultProps): JSX.Element {
  return (
    <form>
      <textarea
        placeholder="前処理ボタンを押してください"
        value={props.result}
        onChange={props.onChange}
      />
    </form>
  );
}


// ======================================================================
function TranslatorButton(): JSX.Element {
  return (
    <button onClick={(): void => console.log('TranslatorButton button pushed')}>
      翻訳
    </button>
  );
}


// ======================================================================
function TranslationResult(): JSX.Element {
  return (
    <form>
      <textarea
        placeholder="翻訳ボタンを押してください"
        onChange={(): void => console.log('TranslationResult change')}
      />
    </form>
  );
}


// ======================================================================
ReactDOM.render(
  <Top />,
  document.getElementById('root')
);
