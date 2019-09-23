import React, { Component } from 'react';
import { ContextUserConsumer } from "../context/ContextFirebaseUserProvider";
import { firestore } from "../base";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginEmail: '',
      loginPin: '',
    };
  }

  handleLoginEmailInputChange = e => {
    this.setState({
      loginEmail: e.currentTarget.value
    })
  }

  handleLoginPinInputChange = e => {
    this.setState({
      loginPin: e.currentTarget.value
    })
  }

  handleLogin = e => {
    e.preventDefault();
    const users = firestore.collection("users");
    users.where("email", "==", this.state.loginEmail)
    .get()
    .then(data => {
      if (!data.empty) {
        data.forEach(doc => {
          if (doc.data().pin ===  Number(this.state.loginPin)) {
            this.props.setUserData(doc.id);
          } else {
            console.log('fail');
          }
        });
      }
    })
    .catch(function(error) {
      console.log("Error getting documents: ", error);
    });
  }


  render(){
    return (
    <div className="App">
      <h1>Login</h1>
       <form
        onSubmit={e => this.handleLogin(e)}
      >
        <input
          type='email'
          placeholder='Email'
          name="loginEmail"
          value={this.state.loginEmail}
          onChange={e => this.handleLoginEmailInputChange(e)}
        />
        <input
          type='number'
          placeholder='Pin'
          name="loginPin"
          value={this.state.loginPin}
          onChange={e => this.handleLoginPinInputChange(e)}
        />
        <input type='submit' />
      </form>
    </div>
  );
  }
}

const LoginUpdate = (props) => (
  <ContextUserConsumer>
    {({ setUserData }) => (
      <Login
        // remember to spread the existing props otherwise you lose any new ones e.g. 'something' that don't come from the provider
        {...props}
        setUserData={setUserData}
      />
    )}
  </ContextUserConsumer>
);

export default LoginUpdate;
