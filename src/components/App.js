import React, { useState } from 'react';
// import logo from '../media/logo.svg';
import { firestore } from "../base";
import '../styles/App.css';

function App() {

  const [roomName, set_roomName] = useState('')

  const handleInputChange = e => {
    set_roomName(e.currentTarget.value)
  }

  const handleRoomChecker = e => {
    e.preventDefault();
    console.log(roomName);
    const citiesRef = firestore.collection("taverns");
    citiesRef.where("name", "==", roomName)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
  }

  return (
    <div className="App">
      <h1>Login</h1>
       <form onSubmit={e => handleRoomChecker(e)}>
        <input type='text' placeholder='Enter Tavern Name' onChange={e => handleInputChange(e)}/>
      </form>
    </div>
  );
}

export default App;
