import React, { Component } from 'react';
import { ContextUserConsumer } from "../context/ContextFirebaseUserProvider";
import Home from './Home';
import Login from './Login';

class Index extends Component {

  render(){
    return this.props.userLoggedIn ? (
      <Home />
    ) : (
      <Login />
    );
  }
}

const IndexUpdate = props => (
  <ContextUserConsumer>
    {({ userLoggedIn }) => (
      <Index
        {...props}
        userLoggedIn={userLoggedIn}
      />
    )}
  </ContextUserConsumer>
);

export default IndexUpdate;
