import React, {Component} from 'react';
import {connect} from 'react-redux'
import {TimelineMax} from 'gsap';
import PubSub from 'pubsub-js'

class NavigationDots extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: 1,
      animation: true
    }
  }

  componentDidMount() {
    this.dotsCount = this.dotsConteiner.childElementCount
    window.addEventListener('wheel', (e) => {
      const {active, animation} = this.state
      let deltaY = e.deltaY / 100
      if (deltaY > 1) {deltaY = 1}
      if (deltaY < -1) {deltaY = -1}
      if (animation) {  // выключил клик при анимации
        const Goto = active === 1 && deltaY === -1
            ? 1
            : active === this.dotsCount - 1 && deltaY === 1
                ? this.dotsCount - 1
                : active + deltaY
        if (!(active === 1 && deltaY === -1) && !(active === this.dotsCount - 1 && deltaY === 1) ) PubSub.publish('gotoSlide', {from: this.state.active, to: Goto})
      }
    })
    PubSub.subscribe('gotoSlide', (msg, data) => {
      this.props.toggleMenu(data)
      this.onClick(data.to)
    });
  }

  onClickPubSub = (e) => {
    if (this.state.animation) {  // выключил клик при анимации
      const {num} = e.target.dataset
      PubSub.publish('gotoSlide', {from: this.state.active, to: +num});
    }
  }

  onClick = (num) => {
    this.setState({animation: false})
    this.animation(num)
  }

  animation = (num) => {
    const tl = new TimelineMax();
    const {active} = this.state
    if (+num >= active + 1) {
      tl
          .to(this.animateItem, .5, {
            height: +num === active + 1
                ? 30
                : active !== 1 ? (+num * 20) - 10 - active * 10 : (+num * 20) - 10,
            onComplete: () => {
              this.setState({active: +num})
            }
          })
          .to(this.animateItem, .5, {
            height: 10,
            top: (+num - 1) * 20,
            onComplete: () => {
              this.setState({animation: true})
            }   // включил клик при анимации
          })
    } else {
      tl
          .to(this.animateItem, .5, {
            height: +num === active - 1
                ? 30
                : active * 20 - +num * 20 + 10,
            top: (+num - 1) * 20,
            onComplete: () => {
              this.setState({
                active: +num
              })
            }
          })
          .to(this.animateItem, .5, {
            height: 10,
            onComplete: () => {
              this.setState({animation: true})
            }  // включил клик при анимации
          })
    }
  }

  render() {
    const {active} = this.state;
    return (
        <div className="dotsContainer" ref={node => this.dotsConteiner = node}>
          <div ref={node => this.animateItem = node} className="dotAnimateItem"/>
          <div data-num={1} className={`dotItem ${active === 1 ? 'active' : false}`} onClick={this.onClickPubSub}/>
          <div data-num={2} className={`dotItem ${active === 2 ? 'active' : false}`} onClick={this.onClickPubSub}/>
          <div data-num={3} className={`dotItem ${active === 3 ? 'active' : false}`} onClick={this.onClickPubSub}/>
        </div>
    );
  }
}
function mapStateToProps(state) {
  return { scroll: state.scroll };
}
function mapDispatchToProps(dispatch) {
  return { toggleMenu: (show) => dispatch({ type: 'SCROLL', payload: show }) };
}

export default connect(mapStateToProps, mapDispatchToProps)(NavigationDots)
