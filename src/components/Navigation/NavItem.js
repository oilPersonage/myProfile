import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navigation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hovered: false,
    };
  }

  render() {
    const { text, link } = this.props.item;
    console.log(this.props)
    return (
      <Link to={link} className="NavLink">{text}</Link>
    );
  }
}
