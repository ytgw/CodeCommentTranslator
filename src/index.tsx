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

  render(): JSX.Element {
    return (
      <div className="AppMain">
        <div className="AppMainForm"><SourceInput value={''} onChange={(): void => console.log('SourceInput change')} /></div>
        <div className="AppMainButton"><PreProcessButton /></div>
        <div className="AppMainForm"><PreProcessResult /></div>
        <div className="AppMainButton"><TranslatorButton /></div>
        <div className="AppMainForm"><TranslationResult /></div>
      </div>
    );
  }
}


// ======================================================================
type SourceInputProps = {
  value: string,
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

function SourceInput(props: SourceInputProps): JSX.Element {
  return (
    <form>
      <input
        type="text"
        placeholder="翻訳したいソースコードを入力してください。"
        value={props.value}
        onChange={props.onChange}
      />
    </form>
  );
}


// ======================================================================
function PreProcessButton(): JSX.Element {
  return (
    <button onClick={(): void => console.log('PreProcessButton button pushed')}>
      前処理
    </button>
  );
}


// ======================================================================
function PreProcessResult(): JSX.Element {
  return (
    <form>
      <input
        type="text"
        placeholder="前処理ボタンを押してください"
        onChange={(): void => console.log('PreProcessResult change')}
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
      <input
        type="text"
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
