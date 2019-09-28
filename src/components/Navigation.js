import React, { Component } from 'react';
import { ContextUserConsumer } from "../context/ContextFirebaseUserProvider";
import { Link } from 'react-router-dom';

class Navigation extends Component {

  render(){
    return (
      <nav className="bz-navigation">
        <ul className="bz-navigation__wrapper">
          <li>
            <Link to={`/user/${this.props.userId}`}>Home</Link>
          </li>
          <li>
            <Link to={`/settings/${this.props.userId}`}>Settings</Link>
          </li>
        </ul>
      </nav>
    );
  }
}

const NavigationUpdate = props => (
  <ContextUserConsumer>
    {({ userId }) => (
      <Navigation
        {...props}
        userId={userId}
      />
    )}
  </ContextUserConsumer>
);

export default NavigationUpdate;
