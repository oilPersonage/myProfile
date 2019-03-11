import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Power2, TweenLite} from 'gsap'
import TimelineMax from 'gsap/TimelineMax';

class Navigation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      arrNavItem: [
        { text: 'Главная', ref: 'home', number: 1 },
        { text: 'Мои работы', ref: 'works', number: 2},
        { text: 'Контакты', ref: 'contacts', number: 3 },
      ],
      width: 0,
      left: 0,
      active: "home",
      heightMenu: '',
    };
  }

  componentDidMount() {
    this.cont = this[this.state.active].getBoundingClientRect();
    console.log(this.cont)
    this.setState({ width: this.cont.width - 35, left:  this.cont.x - this.menu.getBoundingClientRect().x + 10});
  }

  componentWillReceiveProps(next) {
    if (this.props.menu === next.menu) return
    this.cont = this[this.event.dataset.to].getBoundingClientRect();
    const body = document.getElementsByClassName("contComp")
    const num = next.menu.active
    const menu = this.menu.getBoundingClientRect();
    const timeline = new TimelineMax();
    if (+this.props.menu.active > +num) {
      timeline.fromTo(body, 1, {x: `-${100 *(this.props.menu.active - 1)}%`}, {x: `-${100 * (num - 1)}%`, ease: Power2.easeOut})
      TweenLite.to(body, 0.5, {skewX: 5})
      TweenLite.to(body, 0.5, {skewX: 0, delay: 0.5})
    } else {
      timeline.fromTo(body, 1, {x: `-${100 *(this.props.menu.active - 1)}%`}, {x: `-${100 * (num - 1)}%`, ease: Power2.easeOut})
      TweenLite.to(body, 0.5, {skewX: -5})
      TweenLite.to(body, 0.5, {skewX: 0, delay: 0.5})
    }
    console.log(this[this.event.dataset.to].clientWidth)
    this.setState({
      active: this.event.dataset.to,
      left: this.cont.x - menu.x + 10,
      width: this[this.event.dataset.to].clientWidth - 20,
    });
  }

  goTo = (event) => {
    const num = event.target.dataset.number
    this.event = event.target
    this.event.dataset.number !== 2 && this.props.scrollWork({from: this.props.scroll.to, to: 1})
    this.props.onClick(+num)
  }

  render() {
    const { widthMenu, heightMenu } = this.state;
    // const transformMenu = `translate(${-widthMenu / 2}px, ${-heightMenu / 2}px)`;
    // navBox
    console.log(this.state.width)
    const style = {
      transition: 'all 0.3s ease',
      width: this.state.width,
      left: this.state.left,
    };
    return (
      <div
        className="navBox"
        ref={node => this.menu = node}
      >
        <div
          className="navItem active"
          style={style}
        />
        {this.state.arrNavItem.map(item =>
          (<div className="navItem" key={item.number} ref={node => this[item.ref] = node} >
            <div
              className="navElem"
              key={item.text}
              data-to={item.ref}
              data-number={item.number}
              onClick={this.goTo}
            >{item.text}</div>

          </div>))}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { menu: state.menu, scroll: state.scroll };
}
const mapDispatchToProps = dispatch => ({
  scrollWork: obj => dispatch({type: 'SCROLL', payload: obj}),
  onClick: (numb) => {
    dispatch({ type: 'MENU', payload: numb });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
