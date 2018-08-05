import React, { Component } from 'react';
import WebGl from './WebGL/app';

class Home extends Component {
  componentDidMount() {
    console.log(this.cont);
    // const WebGl = require('./WebGL/app');
    WebGl(this.cont);
  }

  render() {
    return (
      <div className="containerHome" ref={node => this.cont = node} />
    );
  }
}

export default Home;
