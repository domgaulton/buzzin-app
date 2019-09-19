import React, { useState } from 'react';
import { firestore } from "../base";
import '../styles/App.css';

function Home(props) {

  const [loginEmail, set_loginEmail] = useState('');
  const [loginPin, set_loginPin] = useState('');

  const handleLoginEmailInputChange = e => {
    set_loginEmail(e.currentTarget.value)
  }

  const handleLoginPinInputChange = e => {
    set_loginPin(Number(e.currentTarget.value))
  }

  const handleLogin = e => {
    e.preventDefault();
    console.log(loginEmail, loginPin);
    const users = firestore.collection("users");
    users.where("email", "==", loginEmail)
    .get()
    .then(function(data) {
      console.log(data)
      if (!data.empty) {
        data.forEach(function(doc) {
          console.log(doc.id);
          props.history.push(`/user/${doc.id}`)
        });
      }
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
  }



  return (
    <div className="App">
      <h1>Login</h1>
       <form
        onSubmit={e => handleLogin(e)}
      >
        <input
          type='email'
          placeholder='Email'
          name="loginEmail"
          value={loginEmail}
          onChange={e => handleLoginEmailInputChange(e)}
        />
        <input
          type='number'
          placeholder='Pin'
          name="loginPin"
          value={loginPin}
          onChange={e => handleLoginPinInputChange(e)}
        />
        <input type='submit' />
      </form>
    </div>
  );
}

export default Home;
