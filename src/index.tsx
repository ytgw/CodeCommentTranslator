import React from 'react';
import ReactDOM from 'react-dom';
import {App} from './app';
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
ReactDOM.render(
  <Top />,
  document.getElementById('root')
);
