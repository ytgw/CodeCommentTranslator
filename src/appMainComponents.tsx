import React from 'react';
import './index.css';


// ======================================================================
type SourceInputProps = {
  value: string,
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
}

export function SourceInput(props: SourceInputProps): React.ReactElement {
  return (
    <form>
      <textarea
        placeholder="翻訳したいソースコードを入力してください。"
        wrap="off"
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

export function PreProcessButton(props: PreProcessButtonProps): React.ReactElement {
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

export function PreProcessResult(props: PreProcessResultProps): React.ReactElement {
  return (
    <form>
      <textarea
        placeholder="前処理ボタンを押してください。"
        wrap="off"
        value={props.result}
        onChange={props.onChange}
      />
    </form>
  );
}


// ======================================================================
type TranslatorButtonProps = {
  isHighlight: boolean,
  onClick: () => void
}

export function TranslatorButton(props: TranslatorButtonProps): React.ReactElement {
  const style: React.CSSProperties = {
    backgroundColor: props.isHighlight ? '#ffeeee' : undefined,
  };

  return (
    <button style={style} onClick={props.onClick}>
      翻訳サイトへ
    </button>
  );
}


// ======================================================================
type TranslationResultProps = {
  result: string
}

export function TranslationResult(props: TranslationResultProps): React.ReactElement {
  return (
    <form>
      <textarea
        placeholder="翻訳ボタンを押してください。"
        wrap="off"
        readOnly={true}
        value={props.result}
      />
    </form>
  );
}
