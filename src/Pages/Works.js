import React, {Component} from 'react';
import {TweenLite} from "gsap";
import {connect} from "react-redux";
import NavigationDots from '../components/Navigation/NavigationDots';

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
    if (nextProps.scroll !== this.state.scroll && this.state.scrollComplite) {
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
          <NavigationDots/>
          <div className="scrollContainer" style={{transform: `translateY(${this.state.transform}px)`}}>
            <div className="containerBlock containerBlockOne" ref={node => this.block = node} style={{backgroundImage: `url(${image})`,}}>
            </div>
            <div className="containerBlock containerBlockTwo">
              2
              <div className="containerBlockTwo-absolute"
                   style={{backgroundPositionY: `-${window.innerHeight - 1}px`}}/>
              <div className="containerBlockTwo-bottom"/>
            </div>
            <div className="containerBlock containerBlockThree">3</div>
          </div>
        </div>
    );
  }

}

function mapStateToProps(state) {
  return {scroll: state.scroll};
}

function mapDispatchToProps(dispatch) {
  return {toggleMenu: show => dispatch({type: 'SCROLL', payload: show})};
}

export default connect(mapStateToProps, mapDispatchToProps)(Works);
