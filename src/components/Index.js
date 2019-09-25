import React, { Component } from 'react';
import { ContextUserConsumer } from "../context/ContextFirebaseUserProvider";
// import Home from './Home';
import Login from './Login';
import { Redirect } from 'react-router-dom';

class Index extends Component {

  render(){
    return this.props.userLoggedIn ? (
      <Redirect push to={`/user/${this.props.userId}`}/>
    ) : (
      <Login />
    );
  }
}

const IndexUpdate = props => (
  <ContextUserConsumer>
    {({ userId, userLoggedIn }) => (
      <Index
        {...props}
        userId={userId}
        userLoggedIn={userLoggedIn}
      />
    )}
  </ContextUserConsumer>
);

export default IndexUpdate;
