import React, {Component} from 'react';
import {TweenLite} from "gsap";
import {connect} from "react-redux";
import NavigationDots from '../components/Navigation/NavigationDots';
import Canvas from '../components/Navigation/Canvas/CircleCanvas';

import image from '../images/1.jpg'

class Works extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scroll: {from: 1, to: 2},
      transform: 0,
      imageComplete: false,
      scrollComplite: true,
      image: {height: document.body.clientHeight, width: document.body.clientWidth}
    }
    this.img = new Image()
  }

  componentDidMount() {
    this.img.src = image
    this.img.onload = () => {
      this.setState({imageComplete: true})
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.scroll !== this.state.scroll && this.state.scrollComplite && this.props.menu.active === 2) {
      this.setState({scroll: nextProps.scroll});
      this.scrollAnimation(nextProps.scroll);
    }
  }

  scrollAnimation = (nextProps) => {
    this.setState({scrollComplite: false})
    const height = this.block.clientHeight
    const {from, to} = nextProps
    const progr = {num: 0}
    TweenLite.to(progr, 1, {
      num: 1,
      onUpdate: () => {
        const direction = from < to ? -1 : 1
        const scrollTo = from < to
            ? progr.num * (height * (Math.abs(from - to)) * direction)
            : (1 - progr.num * (height * (Math.abs(from - to)) * direction))
        if (from < to) {
          this.setState({transform: ((from - 1) * height) * direction + scrollTo})
        } else {
          this.setState({transform: ((from - 1) * height) * -direction - scrollTo})
        }
      },
      onComplete: () => {
        this.setState({scrollComplite: true})
      }
    })
  }

  render() {
    return (
        <div className="containerHome"
             style={{
               opacity: this.state.imageComplete ? 1 : 0,
               transition: 'opacity 0.3s',
             }}>
          <NavigationDots />
          <div className="scrollContainer" style={{transform: `translateY(${this.state.transform}px)`}}>
            {/*<div className="containerBlock containerBlockOne" ref={node => this.block = node} style={{backgroundImage: `url(${image})`,}} />*/}
            <div className="containerBlock containerBlockTwo" ref={node => this.block = node}>

              <Canvas />
              <div className="containerBlockTwo-bottom"></div>
              <div className="containerBlockTwo-rock"></div>
              <div className="containerBlockTwo-white"></div>
            </div>
            <div className="containerBlock containerBlockThree">
              <div className="title">Список моих работ будет пополняться со временем!</div>
            </div>
          </div>
        </div>
    );
  }

}

function mapStateToProps(state) {
  return {scroll: state.scroll, menu: state.menu};
}

function mapDispatchToProps(dispatch) {
  return {toggleMenu: show => dispatch({type: 'SCROLL', payload: show})};
}

export default connect(mapStateToProps, mapDispatchToProps)(Works);
