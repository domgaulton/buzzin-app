import React, { Component } from 'react';
import { ContextUserConsumer } from "../../context/ContextFirebaseUserProvider";
import { withRouter } from 'react-router-dom';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
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

  resetPassword = e => {
    this.setState({
      resetPassword: !this.state.resetPassword
    })
  }


  handleSubmit = e => {
    e.preventDefault();
    if (this.state.resetPassword) {
      this.props.phoneLogin(this.state.email, document.querySelector('#sign-in-button'));
      this.setState({
        email: '',
        password: '',
        resetPassword: false,
      })
    } else {
      this.props.loginUser(this.state.email, this.state.password);
      this.setState({
        email: '',
        password: '',
      })
    }
  }

  handleCreateUser = e => {
    e.preventDefault();
    this.props.createAuthUser(this.state.createEmail, this.state.createPassword, this.state.createName)
  }

  render(){
    return (
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
              disabled={
                this.state.createName === '' ||
                this.state.createEmail  === '' ||
                this.state.createPassword === ''}
            />
          </form>
          <p onClick={() => this.props.changeLoginMethod('loginEmail')}>Have an account already? Login here</p>
          <p onClick={() => this.props.changeLoginMethod('loginPhone')}>Register with Phone</p>
        </div>
      );
  }
}

const LoginUpdate = (props) => (
  <ContextUserConsumer>
    {({ userLoggedIn, userId, setUserData, loginUser, createAuthUser, resetPassword, phoneLogin }) => (
      <Login
        // remember to spread the existing props otherwise you lose any new ones e.g. 'something' that don't come from the provider
        {...props}
        userLoggedIn={userLoggedIn}
        userId={userId}
        setUserData={setUserData}
        loginUser={loginUser}
        createAuthUser={createAuthUser}
        resetPassword={resetPassword}
        phoneLogin={phoneLogin}
      />
    )}
  </ContextUserConsumer>
);

export default withRouter(LoginUpdate);
