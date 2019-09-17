import React from 'react';
import logo from '../media/logo.svg';
import base from "../base";
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
    const studioName = base.ref('test-studio/name');
    studioName.on('value', function(snapshot) {
      console.log(snapshot);
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
          onClick={e => writeUserData(e)}
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
