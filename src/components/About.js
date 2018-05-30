import React, { Component } from 'react';
import logo from '../images/logo.svg';
import '../css/main.css';

class About extends Component {
  render() {
    return (
      <div className="RoutContainer">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          Главная страница
        </p>
      </div>
    );
  }
}

export default About;
