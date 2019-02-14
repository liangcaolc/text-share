import React, { Component } from 'react';
import './App.css';
import TextSubmit from './TextSubmit';
class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>Text Share</p>
        </header>
        <TextSubmit/>
      </div>
    );
  }
}

export default App;
