import React from 'react';
import logo from '../media/logo.svg';
import { firestore } from "../base";
import '../styles/App.css';

function App() {

  const tavernData = e => {
    e.preventDefault();

    // - WORKING - https://firebase.google.com/docs/firestore/quickstart
    firestore.collection("taverns").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          console.log(`${doc.id} => ${doc.data()}`);
      });
    });

    // https://firebase.google.com/docs/firestore/query-data/listen
    firestore.collection("taverns").doc('another-tavern')
      .onSnapshot({
        // Listen for document metadata changes
        includeMetadataChanges: true
      }, function(doc) {
        var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
        console.log(source, " data: ", doc.data());
        const tavernName = doc.data().name;
        console.log(tavernName);
    });
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
          onClick={e => tavernData(e)}
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
