import React, { Component } from 'react';
import { ContextConsumer } from "../context/ContextFirebaseProvider";
import { firestore } from "../base";
import '../styles/App.css';


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomName: '',
      createRoomName: false,
      createPin: '',
    };
  }

  // const [roomName, set_roomName] = useState('');
  // const [createRoomName, set_createRoomName] = useState('');
  // const [createPin, set_createPin] = useState('');

  handleInputChange = e => {
    this.setState({
      roomName: e.currentTarget.value
    })
  }

  handleRoomChecker = e => {
    e.preventDefault();
    // console.log(roomName);
    const taverns = firestore.collection("taverns");
    taverns.where("name", "==", this.props.roomName)
    .get()
    .then(function(data) {
      console.log(data)
      if (!data.empty) {
        data.forEach(function(doc) {
          console.log(doc.id);
          this.props.history.push(`/tavern/${doc.id}`)
        });
      }
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
  }

  handleCreateRoom = e => {
    console.log('test')
    e.preventDefault();
    // const data = {
    //   name: createRoomName,
    //   pin: createPin,
    // }

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

  handle_createRoomNameInputChange = e => {
    this.setState({
      createRoomName: e.currentTarget.value
    })
    // set_createRoomName(e.currentTarget.value)
    // console.log(createRoomName)
  }

  handle_createPinInputChange = e => {
    // set_createPin(e.currentTarget.value)
    // console.log(createPin)
    this.setState({
      createPin: e.currentTarget.value
    })
  }
  render(){
    return (
      <div className="App">
        <h1>Create Tavern</h1>
         <form onSubmit={e => this.handleCreateRoom(e)}>
          <input
            type='text'
            placeholder='Enter Tavern Name'
            value={this.state.createRoomName}
            onChange={e => this.handle_createRoomNameInputChange(e)}
          />
          <input
            type='text'
            placeholder='Enter Pin'
            value={this.state.createPin}
            onChange={e => this.handle_createPinInputChange(e)}
          />
          <input type="submit" />
        </form>

        <h1>{this.props.userData} Rooms</h1>
          <ul>
            <li>Room 1</li>
          </ul>
      </div>
    );
  }
}

const HomeUpdate = props => (
  <ContextConsumer>
    {({ userData, membersReady }) => (
      <Home
        // remember to spread the existing props otherwise you lose any new ones e.g. 'something' that don't come from the provider
        {...props}
        userData={userData}
        membersReady={membersReady}
      />
    )}
  </ContextConsumer>
);

export default HomeUpdate;
