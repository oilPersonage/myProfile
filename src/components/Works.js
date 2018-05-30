import React, { Component } from 'react';
import logo from '../images/logo.svg';
// import '../css/main.css';

class Works extends Component {
  render() {
    return (
      <div className="RoutContainer">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          WORKS
        </p>
      </div>
    );
  }
}

export default Works;
