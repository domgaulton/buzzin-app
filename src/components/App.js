import React, { useState } from 'react';
import logo from '../media/logo.svg';
import { firestore } from "../base";
import '../styles/App.css';

function App() {
  const [tavernName, setTavernName] = useState('');
  const [countdown, setCountdown] = useState(undefined);

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
        const countdown = doc.data().options.countdown;
        console.log(tavernName);
        setTavernName(tavernName);
        setCountdown(countdown)
    });
  }



  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <h1>{tavernName}</h1>
        <p>{countdown}</p>
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
