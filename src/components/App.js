import React from 'react';
import {
  BrowserRouter,
  Route,
} from 'react-router-dom';

// HEAD components
import About from './About';
import Home from './Home';
import Work from './Works';

// Small Components
import Navigation from './Navigation/Navigation';

function App() {
  return (
    <BrowserRouter>
      <div className="RouterContainer">
        <Navigation />
        <Route path="/home" component={Home} />
        <Route path="/works" component={Work} />
        <Route path="/about" component={About} />
      </div>
    </BrowserRouter>
  );
}

export default App;
