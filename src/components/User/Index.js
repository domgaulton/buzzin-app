import React, { Component } from 'react';
import { ContextUserConsumer } from "../../context/ContextFirebaseUserProvider";
import { firestore } from "../../base";
import { Link } from "react-router-dom";
import UserTaverns from './UserTaverns'


class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomName: '',
      createRoomName: false,
      createPin: '',
      taverns: []
    };
  }

  componentDidMount(){
    if (this.props.userData && this.props.userData.taverns){
      this.tavernIdsToState();
    }
  }

  componentDidUpdate(prevProps){
    if (this.props.userData.taverns !== prevProps.userData.taverns) {
      this.tavernIdsToState();
    }
  }

  tavernIdsToState(){
    this.props.userData.taverns.forEach(item => {
      console.log(item)
      firestore.collection("taverns").doc(item)
        .onSnapshot({
          includeMetadataChanges: true
        },(doc) => {
          const id = doc.id;
          const name = doc.data().name;
          const tavernObj = {
            id,
            name,
          }
          this.setState(prevState => ({
            taverns: [...prevState.taverns, tavernObj]
          }))
        });
    })
  }

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

        <h1>{this.props.userData.name}'s Rooms</h1>

        <UserTaverns />

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
