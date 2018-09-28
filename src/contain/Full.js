
import {
  Redirect,
  Switch,
  Route,
} from 'react-router-dom';
import React, { Component } from 'react';

import Home from '../Pages/Home/Home';
import Contacts from '../Pages/Contacts';
import Work from '../Pages/Works';
import Navigation from '../components/Navigation/Navigation/Navigation';


export default class Full extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="containerComponent">
        <Navigation {...this.props} />
        {/* <Switch> */}
        <div className="contComp">
          <Home />
          <Work />
          <Contacts />
        </div>
      </div>
    );
  }
}
