import React from 'react';
import logo from '../media/logo.svg';
import { firestore } from "../base";
import '../styles/App.css';

function App() {

  // const getDatabase = e => {
  //   e.preventDefault();
  //   const studioOne = base.ref('test-studio');
  //   // studioOne.on('name', function(snapshot) {
  //   //   console.log(snapshot.val())
  //   // });
  // //   studioOne.on('value', function(snapshot) {
  // //   updateStarCount('name', snapshot.val());
  // // });
  //   console.log(studioOne);
  // }

  const writeUserData = e => {
    e.preventDefault();
    // base.ref('test-studio/members/member0').set({
    //   name: 'Test',
    //   score: 0,
    // });

  // - WORKING - https://firebase.google.com/docs/firestore/quickstart
  // https://firebase.google.com/docs/firestore/query-data/listen

    // firestore.collection("taverns").add({
    //   first: "Ada",
    //   last: "Lovelace",
    //   born: 1815
    //   })
    //   .then(function(docRef) {
    //       console.log("Document written with ID: ", docRef.id);
    //   })
    //   .catch(function(error) {
    //       console.error("Error adding document: ", error);
    // });

    firestore.collection("taverns").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          console.log(`${doc.id} => ${doc.data()}`);
      });
    });

    firestore.collection("taverns").doc('another-tavern')
      .onSnapshot({
        // Listen for document metadata changes
        includeMetadataChanges: true
      }, function(doc) {
        var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
        console.log(source, " data: ", doc.data());
      });

  // - WORKING - https://firebase.google.com/docs/firestore/quickstart

    // console.log(firestore.collection("taverns"));
    // console.log(tavern('test-tavern'));
    // console.log(firestore);
    // console.log(firebaseApp)

    // firebaseApp.taverns.on('value', snapshot => {
    //   const usersObject = snapshot.val();
    //   const usersList = Object.keys(usersObject).map(key => ({
    //     ...usersObject[key],
    //     uid: key,
    //   }));

    //   this.setState({
    //     users: usersList,
    //     loading: false,
    //   });
    //   console.log(usersList);
    // });


    // const studioName = database.ref('test-studio/');
    // console.log(studioName)
    // studioName.on('value', function(snapshot) {
    //   console.log(snapshot.name);
    // });
    // studioName.once('value')
    // .then(function(snapshot) {
    //   //var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
    //   const name = snapshot.val().name;
    //   console.log(name)
    //   // ...
    // })
  }



  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => writeUserData(e)}
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
