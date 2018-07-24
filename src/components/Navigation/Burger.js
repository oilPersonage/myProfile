import React, { Component } from 'react';
import { TweenMax, Power4 } from 'gsap';
import {connect} from "react-redux";

class Burger extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };

    this.animation = false;
    this.show = false;

    this.Animation = (target) => TweenMax
      .staggerFromTo(target, 0.5, { width: 0 }, { width: 50 }, 0.2);
  }

  AnimationBurger = (array) => {
    const target = [];
    for (let i = 0; i < array.children.length; i++) {
      target.push(array.children[i]);
    }
    this.Animation(target);
  }

  componentWillReceiveProps (nextProps) {
    this.animation = nextProps.menu.animation
    this.show = nextProps.menu.show
    if (this.show && this.animation === false) {
      clearInterval(this.IntervalAnimation);
      TweenMax.to(this.burgerItemTop, 0.3, {rotation: 45, top: 15})
      TweenMax.to(this.burgerItemMiddle, 0, {opacity: 0})
      TweenMax.to(this.burgerItemBottom, 0.3, {rotation: -225, top: 15})
    }
  }

  componentDidMount() {
    this.IntervalAnimation = setInterval(() => this.AnimationBurger(this.burgerBox), 3000)
  }

  componentWillUnmount() {
    clearInterval(this.IntervalAnimation);
  }

  toggleMenu = () => {
    if (this.animation) {return}
    this.show && this.props.animationMenu()
    if (this.state.isOpen) {
      this.IntervalAnimation = setInterval(() => this.AnimationBurger(this.burgerBox), 3000)
      TweenMax.to(this.burgerItemTop, 0.3, {rotation: 0, top: 0})
      TweenMax.to(this.burgerItemMiddle, 0, {opacity: 1})
      TweenMax.to(this.burgerItemBottom, 0.3, {rotation: 0, top: 30})
      this.AnimationBurger(this.burgerBox)
    }
    this.setState({isOpen: !this.state.isOpen})
    !this.state.isOpen && this.props.toggleMenu()
  }

  render() {
    const isOpen = this.props.menu.show
    return (
      <div className="burgerBox" onClick={this.toggleMenu}>
        <div  className={`posR ${isOpen && "isOpen"}`} ref={node => this.burgerBox = node}>
          <div className="burgerItem Bg1" ref={node => this.burgerItemTop = node}/>
          <div className="burgerItem Bg2" ref={node => this.burgerItemMiddle = node}/>
          <div className="burgerItem Bg3" ref={node => this.burgerItemBottom = node}/>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return { menu: state.menu };
}

export default connect(mapStateToProps, dispatch => ({toggleMenu: (show) => dispatch({ type: 'MENU', payload: show }), animationMenu: () => dispatch({ type: 'AnimationFadeIn' }) }) )(Burger);
