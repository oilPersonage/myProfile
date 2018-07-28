import React, { Component } from 'react';
import NavItem from '../Smalles/NavItem';
import { connect } from 'react-redux';
import { TweenLite } from 'gsap';

class Navigation extends Component {
  constructor(props) {
    super(props)

    this.state = {
      heightMenu: '',
    }
  }

  animationMenu = (menu) => {
    const {animation, show} = menu
    const thisMenu = this.menu
    show && animation === false ? TweenLite.fromTo(
        thisMenu,
        0.8,
        {scale: 0.8,
          x: -this.menu.clientWidth / 2, y: -this.menu.clientHeight / 2,
          opacity: 0,
          ease: Back.easeInOut.config(1.7)},
        {scale: 1 ,
          x: -this.menu.clientWidth / 2, y: -this.menu.clientHeight / 2,
          opacity: 1,
          ease: Back.easeInOut.config(1.7)}) : null
    if (animation) {TweenLite.fromTo(
        thisMenu,
        1,
        {scale: 1,
          x: -this.menu.clientWidth / 2, y: -this.menu.clientHeight / 2,
          opacity: 1,
          ease: Back.easeInOut.config(1.7)},
        {scale: 0,
          x: -this.menu.clientWidth / 2, y: -this.menu.clientHeight / 2,
          opacity: -1,
          ease: Back.easeInOut.config(1.7),
          onComplete: () => {
            const TimeO = setTimeout(() => {
              this.props.animationMenu();
              this.props.onClick();
              clearTimeout(TimeO)}
              , 600)
          }
        }); }
  }

  componentDidMount() {
    this.interval(this.props.menu, 500)
  }

  interval = (props, interval) => {
    const TimeO = setTimeout(()=> {
      this.animationMenu(props)
      clearTimeout(TimeO)
    }, interval)
  }

  componentWillReceiveProps(nextProps) {
    nextProps.menu.animation && this.interval(nextProps.menu, 0)
  }

  render() {
    const {widthMenu, heightMenu} = this.state
    const arrNavItem = {
      home: { text: 'Главная', link: '/' },
      works: { text: 'Мои работы', link: '/works' },
      about: { text: 'Контакты', link: '/contacts' },
    };
    const transformMenu = `translate(${-widthMenu / 2}px, ${-heightMenu / 2}px)`
    return (
      <div className="navBox" ref={node => this.menu = node}
           style={{opacity: 0, transform: transformMenu, width: widthMenu}}>
        {Object.keys(arrNavItem).map((item, index) => <NavItem key={index} onClick={this.props.animationMenu} item={arrNavItem[item]} />)}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { menu: state.menu };
}
const mapDispatchToProps = (dispatch) => {
  return {
    animationMenu: () => dispatch({ type: 'AnimationFadeIn' }),
    onClick: () => {
      dispatch({type: "MENU", payload: false})
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
