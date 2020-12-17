import React from 'react';
import {SetString} from './sourceCodeAnalyzer';
import {ProgramLang, ProgramLangsContainer} from './programmingLanguage';
import './index.css';

type CommentConfigProps = {
  lang: ProgramLang,
  langsContainer: ProgramLangsContainer,
  isCustomLang: boolean,
  onLangChange: (event: React.ChangeEvent<HTMLSelectElement>) => void,
}

type CommentConfigState = {
  lineComments: string[],
  blockComments: SetString[],
}

export class CommentConfig extends React.Component<CommentConfigProps, CommentConfigState> {
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

  onLineCommentsChange(str: string, idx: number): void {
    const lineComments = this.state.lineComments;
    if (idx < lineComments.length) {
      lineComments[idx] = str;
    } else {
      lineComments.push(str);
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

  onBlockCommentsChange(str: string, idx: number, isStart: boolean): void {
    const blockComments = this.state.blockComments;
    let start: string;
    let end: string;
    if (idx < blockComments.length) {
      start = isStart ? str : blockComments[idx].start;
      end = !isStart ? str : blockComments[idx].end;
      blockComments[idx] = {start, end};
    } else {
      start = isStart ? str : '';
      end = !isStart ? str : '';
      blockComments.push({start, end});
    }
    this.setState({blockComments: blockComments});
  }

  renderCustomBlockComment(): JSX.Element {
    const blockComments = this.state.blockComments;
    const inputElements: (string | JSX.Element)[] = ['ブロックコメント：「'];
    for (let i = 0; i <= blockComments.length; i++) {
      const value = (i === blockComments.length) ? {start: '', end: ''} : blockComments[i];
      inputElements.push(
        <input
          type="text"
          value={value.start}
          onChange={(e): void => this.onBlockCommentsChange(e.target.value, i, true)}
          key={'blockCommentStart' + i.toString()}
        />
      );
      inputElements.push('〜');
      inputElements.push(
        <input
          type="text"
          value={value.end}
          onChange={(e): void => this.onBlockCommentsChange(e.target.value, i, false)}
          key={'blockCommentEnd' + i.toString()}
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
        {this.renderCustomBlockComment()}
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