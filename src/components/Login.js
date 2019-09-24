import React, { Component } from 'react';
import { ContextUserConsumer } from "../context/ContextFirebaseUserProvider";
// import { firestore } from "../base";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  handleInputChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleLogin = e => {
    e.preventDefault();
    this.props.loginUser(this.state.email, this.state.password)
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
          name="email"
          value={this.state.email}
          onChange={e => this.handleInputChange(e)}
        />
        <input
          type='password'
          placeholder='Password'
          name="password"
          value={this.state.password}
          onChange={e => this.handleInputChange(e)}
        />
        <input type='submit' />
      </form>
    </div>
  );
  }
}

const LoginUpdate = (props) => (
  <ContextUserConsumer>
    {({ setUserData, loginUser }) => (
      <Login
        // remember to spread the existing props otherwise you lose any new ones e.g. 'something' that don't come from the provider
        {...props}
        setUserData={setUserData}
        loginUser={loginUser}
      />
    )}
  </ContextUserConsumer>
);

export default LoginUpdate;
