import React, { Component } from 'react';
import WebGL from './WebGL/app';

class Home extends Component {
  componentDidMount() {
    WebGL(this.cont);
  }
  render() {
    return (
      <div className="containerHome" ref={node => this.cont = node} />
    );
  }
}

export default Home;
