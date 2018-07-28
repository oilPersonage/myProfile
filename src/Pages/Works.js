import React, {Component} from 'react';
import {TweenLite} from "gsap";
import {connect} from "react-redux";
import NavigationDots from '../components/Navigation/NavigationDots';

class Works extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scroll: {from: 1, to: 2},
      transform: 0,
      scrollComplite: true,
      image: {height: document.body.clientHeight, width: document.body.clientWidth}
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
    console.log(nextProps)
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
      onComplete: () => {this.setState({scrollComplite: true})}
    })
  }

  render() {
    return (
        <div className="containerHome">
          <NavigationDots />
          <div className="scrollContainer" style={{transform: `translateY(${this.state.transform}px)`}}>
            <div className="containerBlock containerBlockOne" ref={node => this.block = node}>
            </div>
            <div className="containerBlock containerBlockTwo">
              2
              <div className="containerBlockTwo-absolute"
                   style={{backgroundPositionY: `-${this.state.image.height - 1}px`}}/>
              <div className="containerBlockTwo-bottom"/>
            </div>
            <div className="containerBlock containerBlockThree">3</div>
          </div>
        </div>
    );
  }

}
function mapStateToProps(state) {
  return { scroll: state.scroll };
}
function mapDispatchToProps(dispatch) {
  return { toggleMenu: show => dispatch({ type: 'SCROLL', payload: show }) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Works);
