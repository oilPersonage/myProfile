import React, { Component } from 'react';
import { TweenMax, Power4 } from 'gsap';
import {connect} from "react-redux";

class Burger extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };

    this.Animation = (target, cb) => TweenMax
      .staggerFromTo(target, 0.5, { width: 0 }, { width: 50 }, 0.2);
  }

  AnimationBurger = (array) => {
    const target = [];
    for (let i = 0; i < array.children.length; i++) {
      target.push(array.children[i]);
    }
    this.IntervalAnimation = setInterval(() => {
      this.Animation(target);
    }, 4000);
  }

  componentWillReceiveProps () {
    this.props.menu.show && this.onClick()
  }

  componentDidMount() {
    this.AnimationBurger(this.burgerBox)
  }

  componentWillMount() {
    clearTimeout(this.IntervalAnimation);
  }

  toggleMenu = () => {
    let menu = Object.assign({}, this.props.menu)
    menu.animation = this.props.menu.show && !menu.animation
    menu.animation === false && this.props.toggleMenu(!this.props.menu.show)
    menu.animation && this.props.animationMenu()
    this.onClick()
  }

  onClick = () => {
    const isOpen = !this.props.menu.show
    if (isOpen) {
      clearTimeout(this.IntervalAnimation);
      TweenMax.to(this.burgerItemTop, 0.3, {rotation: 45, top: 15})
      TweenMax.to(this.burgerItemMiddle, 0, {opacity: 0})
      TweenMax.to(this.burgerItemBottom, 0.3, {rotation: -225, top: 15})
    } else {
      TweenMax.to(this.burgerItemTop, 0.3, {rotation: 0, top: 0})
      TweenMax.to(this.burgerItemMiddle, 0, {opacity: 1})
      TweenMax.to(this.burgerItemBottom, 0.3, {rotation: 0, top: 30})
      this.AnimationBurger(this.burgerBox)
    }
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
