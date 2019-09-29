import React, { Component } from 'react';
import { ContextUserConsumer } from "../context/ContextFirebaseUserProvider";
import Login from './Auth/Login';
// import User from './User/Index';
import { Redirect } from 'react-router-dom';

class Index extends Component {

  render(){
    console.log(this.props.userLoggedIn)
    return this.props.userLoggedIn ? (
      <Redirect push to={`/user/${this.props.userId}`} />
      //<User userId={this.props.userId}/>
    ) : (
      <Redirect push to="/login" />
    );
  }
  // render() {
  //   return <Login />
  // }
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
