import React from 'react';
import { connect } from 'react-redux';
import Navigation from './Navigation';
import CircleCanvas from './CircleCanvas';

const NavigationConteiner = ({menu}) =>
  (<div>
    { menu.show &&
      <div>
        <CircleCanvas />
        <Navigation />
      </div>
    }
  </div>);

function mapStateToProps(state) {
  return { menu: state.menu };
}
export default connect(mapStateToProps)(NavigationConteiner);
