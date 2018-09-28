import React, { Component } from 'react';
import img from '../images/DSC00228.jpg';

class About extends Component {
  render() {
    return (
      <div className="containerHome contactsContainer">
        <div className="contactImage">
          <img src={img} alt=" "/>
          <div className="contactBG"></div>
        </div>
        <div className="contactTextBlock">
          <div className='leftBlockContact'>
            <a className="phone" href="tel:+79990037029">8 (999) 003-70-29</a>
          </div>
          <div>
            <a className="email" href="mailto:89990037029">oilfreelance@ya.ru</a>
          </div>
        </div>
      </div>
    );
  }
}

export default About;
