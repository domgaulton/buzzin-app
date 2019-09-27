import React, { Component } from 'react';
import { ContextUserConsumer } from "../../context/ContextFirebaseUserProvider";
import { firestore } from "../../base";
import { Link } from "react-router-dom";
import UserTavernList from './UserTavernList';
import CreateNewTavern from './CreateNewTavern';
import FindTavern from './FindTavern';

class User extends Component {

  handleInputChange = e => {
    this.setState({
      roomName: e.currentTarget.value
    })
  }

  handleCreateRoom = e => {
    e.preventDefault();

    firestore.collection("taverns").add({
      name: this.state.createRoomName,
      pin: this.state.createPin,
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
  }

  render(){
    return this.props.userLoggedIn ? (
      <div className="App">

        <button onClick={this.props.logoutUser}>Logout</button>

        <UserTavernList />

        <FindTavern />

        <CreateNewTavern />

      </div>
    ) : (
      <div>
        <h1>You must be logged in</h1>
        <Link to='/'>Login</Link>
      </div>
    )
    ;
  }
}

const UserUpdate = props => (
  <ContextUserConsumer>
    {({ userLoggedIn, userData, logoutUser }) => (
      <User
        // remember to spread the existing props otherwise you lose any new ones e.g. 'something' that don't come from the provider
        {...props}
        userLoggedIn={userLoggedIn}
        userData={userData}
        logoutUser={logoutUser}
      />
    )}
  </ContextUserConsumer>
);

export default UserUpdate;
