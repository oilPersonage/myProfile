import React from 'react';
import { connect } from 'react-redux';
import Navigation from './Navigation';
import CircleCanvas from '../Canvas/CircleCanvas';
import NavigationBack from './NavigationBack'

const NavigationConteiner = ({menu}) =>
  (<div>
      <div>
        {/*<CircleCanvas />*/}
        {/*<NavigationBack />*/}
        <Navigation />
      </div>
  </div>);

function mapStateToProps(state) {
  return { menu: state.menu };
}
export default connect(mapStateToProps)(NavigationConteiner);
