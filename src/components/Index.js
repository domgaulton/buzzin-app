import React, { Component } from 'react';
import { ContextUserConsumer } from "../context/ContextFirebaseUserProvider";
import Home from './Home';
import Login from './Login';

class Index extends Component {

  render(){
    return this.props.userLoggedIn ? (
      <Home userId={this.props.userId} />
    ) : (
      <Login />
    );
  }
}

const IndexUpdate = props => (
  <ContextUserConsumer>
    {({ userLoggedIn, userData }) => (
      <Index
        {...props}
        userLoggedIn={userLoggedIn}
        userData={userData}
      />
    )}
  </ContextUserConsumer>
);

export default IndexUpdate;
