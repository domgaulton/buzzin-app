import React, { useState } from 'react';
import { firestore } from "../base";
import '../styles/App.css';

function Home(props) {

  const [roomName, set_roomName] = useState('');
  const [createRoomName, set_createRoomName] = useState('');
  const [createPin, set_createPin] = useState('');

  const handleInputChange = e => {
    set_roomName(e.currentTarget.value)
  }

  const handleRoomChecker = e => {
    e.preventDefault();
    // console.log(roomName);
    const taverns = firestore.collection("taverns");
    taverns.where("name", "==", roomName)
    .get()
    .then(function(data) {
      console.log(data)
      if (!data.empty) {
        data.forEach(function(doc) {
          console.log(doc.id);
          props.history.push(`/tavern/${doc.id}`)
        });
      }
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
  }

  const handleCreateRoom = e => {
    console.log('test')
    e.preventDefault();
    // const data = {
    //   name: createRoomName,
    //   pin: createPin,
    // }

    firestore.collection("taverns").add({
      name: createRoomName,
      pin: createPin,
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
  }

  const handle_createRoomNameInputChange = e => {

    set_createRoomName(e.currentTarget.value)
    console.log(createRoomName)
  }

  const handle_createPinInputChange = e => {
    set_createPin(e.currentTarget.value)
    console.log(createPin)
  }

  return (
    <div className="App">
      <h1>Create Tavern</h1>
       <form onSubmit={e => handleCreateRoom(e)}>
        <input
          type='text'
          placeholder='Enter Tavern Name'
          value={createRoomName}
          onChange={e => handle_createRoomNameInputChange(e)}
        />
        <input
          type='text'
          placeholder='Enter Pin'
          value={createPin}
          onChange={e => handle_createPinInputChange(e)}
        />
        <input type="submit" />
      </form>

      <h1>{props.userData} Rooms</h1>
        <ul>
          <li>Room 1</li>
        </ul>
    </div>
  );
}

export default Home;
