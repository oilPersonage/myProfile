import React, { Component } from 'react';
import {
  HashRouter,
  Switch,
  Route,
} from 'react-router-dom';
import { Provider } from 'react-redux';

import store from '../store/store';
// HEAD components
import Full from '../contain/Full';


class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Provider store={store}>
        <Full />
      </Provider>
    );
  }
}

{ /* <HashRouter> */ }
{ /* <Switch> */ }
{ /* <div className="RouterContainer"> */ }
{ /* /!* <Burger /> *!/ */ }
{ /* <Route to="/" component={Full} /> */ }
{ /* /!*</div>*!/ */ }
{ /* /!*</Switch>*!/ */ }
{ /* /!*</HashRouter>*!/ */ }
{ /* /!*</Provider>*!/ */ }

export default App;
