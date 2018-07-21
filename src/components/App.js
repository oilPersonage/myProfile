import React from 'react';
import {
  HashRouter,
  Switch,
  Route,
} from 'react-router-dom';
import { Provider } from 'react-redux';

import store from '../store/store';
// HEAD components
import Contacts from './Contacts';
import Home from './Home';
import Work from './Works';
// import Canvas from './Canvas/Burger';

// Small Components

import Burger from './Navigation/Burger';
import NavigationContainer from './Navigation/NavigationContainer'


function App() {
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

export default App;
