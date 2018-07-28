import React, { Component } from 'react';
import {
  HashRouter,
  Switch,
  Route,
} from 'react-router-dom';
import { Provider } from 'react-redux';

import store from '../store/store';
// HEAD components
import Contacts from '../Pages/Contacts';
import Home from '../Pages/Home/Home';
import Work from '../Pages/Works';

// Small Components
import Burger from './Navigation/Burger';
import NavigationContainer from './Navigation/Navigation/NavigationContainer';


class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Provider store={store}>
        <HashRouter>
          <Switch>
            <div className="RouterContainer">
              <Burger />
              <NavigationContainer />
              <Route exact path="/" component={Home} />
              <Route path="/works" component={Work} />
              <Route path="/contacts" component={Contacts} />
              {/* <Canvas /> */}
            </div>
          </Switch>
        </HashRouter>
      </Provider>
    );
  }
}

export default App;
