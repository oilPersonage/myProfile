import React, { Component } from 'react';
import {connect} from 'react-redux'
import {TweenLite, Power3} from 'gsap'

class NavigationBack extends Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(next) {next !== this.props && this.animation()}
  componentDidMount() {this.animationShow()}

  animationShow = () => {
    TweenLite.fromTo(this.top, 0.4, {rotation: 0}, {rotation: "45deg"})
    TweenLite.fromTo(this.bottom, 0.4, {rotation: 0}, {rotation: "45deg"})
  }

  animation = () => {
    TweenLite.to(this.top, 0.5, { rotation: 0, delay: 0.7, ease: Power3.easeIn})
    TweenLite.to(this.bottom, 0.5, { rotation: 0, delay: 0.7, ease: Power3.easeIn})
  }

  render() {
    const position = document.body.clientWidth > 1366
        ? document.body.clientWidth / 4 + 75
        : document.body.clientWidth / 4 - 75
    return (
      <div>
        <div className="navAbsoluteTop navAbsolute" style={{left: position}} ref={node => this.top = node} >
          <div className="dopDiv">

          </div>
        </div>
        <div className="navAbsoluteBottom navAbsolute" style={{right: position}} ref={node => this.bottom = node}>
          <div className="dopDiv">

          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { menu: state.menu };
}
export default connect(mapStateToProps)(NavigationBack)
