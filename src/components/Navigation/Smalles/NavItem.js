import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class NavItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hovered: false,
    };
  }

  render() {
    const { text, link } = this.props.item;
    return (

    );
  }
}
