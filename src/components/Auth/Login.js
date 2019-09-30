import React, { Component } from 'react';
import { ContextUserConsumer } from "../../context/ContextFirebaseUserProvider";
import { withRouter } from 'react-router-dom';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginFormShowing: true,
      email: '',
      password: '',
      createName: '',
      createEmail: '',
      createPassword: '',
    };
  }

  toggleLoginCreateUser = () => {
    this.setState({
      loginFormShowing: !this.state.loginFormShowing
    })
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

  handleCreateUser = e => {
    e.preventDefault();
    this.props.createAuthUser(this.state.createEmail, this.state.createPassword, this.state.createName)
  }


  render(){
    return this.state.loginFormShowing ? (
      <div className="container">
        <h1>Login</h1>
         <form
          onSubmit={e => this.handleLogin(e)}
          className="buzzin-form"
        >
          <input
            className="buzzin-form__item buzzin-form__item--text-input"
            type='email'
            placeholder='Email'
            name="email"
            value={this.state.email}
            onChange={e => this.handleInputChange(e)}
          />
          <input
            className="buzzin-form__item buzzin-form__item--text-input"
            type='password'
            placeholder='Password'
            name="password"
            value={this.state.password}
            onChange={e => this.handleInputChange(e)}
          />
          <input
            className="buzzin-form__item buzzin-form__item--submit"
            type='submit'
            value="Login"
          />
        </form>
        <span onClick={this.toggleLoginCreateUser}>No login? Register here</span>
      </div>
    ) : (
      <div className="container">
        <h1>Register</h1>
          <form
            onSubmit={e => this.handleCreateUser(e)}
            className="buzzin-form"
          >
            <input
              className="buzzin-form__item buzzin-form__item--text-input"
              type='text'
              placeholder='Name'
              name="createName"
              value={this.state.createName}
              onChange={e => this.handleInputChange(e)}
            />
            <input
              className="buzzin-form__item buzzin-form__item--text-input"
              type='email'
              placeholder='Email'
              name="createEmail"
              value={this.state.createEmail}
              onChange={e => this.handleInputChange(e)}
            />
            <input
              className="buzzin-form__item buzzin-form__item--text-input"
              type='password'
              placeholder='Password'
              name="createPassword"
              value={this.state.createPassword}
              onChange={e => this.handleInputChange(e)}
            />
            <input
              className="buzzin-form__item buzzin-form__item--submit"
              type='submit'
              value="Register"
            />
          </form>
          <span onClick={this.toggleLoginCreateUser}>Have an account already? Login here</span>
        </div>
      );
  }
}

const LoginUpdate = (props) => (
  <ContextUserConsumer>
    {({ userLoggedIn, userId, setUserData, loginUser, createAuthUser }) => (
      <Login
        // remember to spread the existing props otherwise you lose any new ones e.g. 'something' that don't come from the provider
        {...props}
        userLoggedIn={userLoggedIn}
        userId={userId}
        setUserData={setUserData}
        loginUser={loginUser}
        createAuthUser={createAuthUser}
      />
    )}
  </ContextUserConsumer>
);

export default withRouter(LoginUpdate);
