import React, { Component } from 'react';
import { ContextUserConsumer } from "../../context/ContextFirebaseUserProvider";
import Login from '../Auth/Login';
import { Link } from 'react-router-dom';

class User extends Component {

  render(){
    return this.props.userLoggedIn && this.props.userData ? (
      <div className="container">
        <h1>Welcome, {this.props.userData.name}!</h1>

        <h3>Notifications</h3>
        <p>No new notifications</p>

        <h3>Friends {this.props.userData.friends.length}</h3>
        <Link className="bz-navigation__item" to='/add-friend'>Add Friend</Link>

        <h3>Score</h3>
        <p>{this.props.userData.score}</p>

      </div>
    ) : (
      <Login />
    );
  }
}

const UserUpdate = props => (
  <ContextUserConsumer>
    {({ userLoggedIn, userData }) => (
      <User
        // remember to spread the existing props otherwise you lose any new ones e.g. 'something' that don't come from the provider
        {...props}
        userLoggedIn={userLoggedIn}
        userData={userData}
      />
    )}
  </ContextUserConsumer>
);

export default UserUpdate;
