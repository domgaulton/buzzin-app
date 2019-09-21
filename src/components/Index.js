import React, { Component } from 'react';
import { ContextConsumer } from "../context/ContextFirebaseProvider";
import Home from './Home';
import Login from './Login';

class Index extends Component {

  render(){
    return this.props.userLoggedIn ? (
      <Home/>
    ) : (
      <Login />
    );
  }
}

const IndexUpdate = props => (
  <ContextConsumer>
    {({ userLoggedIn }) => (
      <Index
        {...props}
        userLoggedIn={userLoggedIn}
      />
    )}
  </ContextConsumer>
);

export default IndexUpdate;
