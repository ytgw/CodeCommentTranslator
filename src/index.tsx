import React from 'react';
import ReactDOM from 'react-dom';
import {ProgramLang, ProgramLangsContainer, ProgramLangName} from './programmingLanguage';
import {LangConfig} from './commentConfig';
import {AppMain} from './app';
import './index.css';


// ======================================================================
type Empty = Record<string, never>

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
  };

  render(): JSX.Element {
    return (
      <>
        <LangConfig
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
ReactDOM.render(
  <App />,
  document.getElementById('root')
);
