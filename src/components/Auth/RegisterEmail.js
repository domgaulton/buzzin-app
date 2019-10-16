import React, { Component } from 'react';
import { ContextUserConsumer } from "../../context/ContextFirebaseUserProvider";
import { withRouter } from 'react-router-dom';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
    };
  }

  handleInputChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.createAuthUser(this.state.email, this.state.password, this.state.name)
  }

  render(){
    return (
      <div className="container">
        <h1>Register</h1>
          <form
            onSubmit={e => this.handleSubmit(e)}
            className="buzzin-form"
          >
            <input
              className="buzzin-form__item buzzin-form__item--text-input"
              type='text'
              placeholder='Name'
              name="name"
              value={this.state.createName}
              onChange={e => this.handleInputChange(e)}
            />
            <input
              className="buzzin-form__item buzzin-form__item--text-input"
              type='email'
              placeholder='Email'
              name="email"
              value={this.state.createEmail}
              onChange={e => this.handleInputChange(e)}
            />
            <input
              className="buzzin-form__item buzzin-form__item--text-input"
              type='password'
              placeholder='Password'
              name="password"
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
    {({ createAuthUser }) => (
      <Login
        // remember to spread the existing props otherwise you lose any new ones e.g. 'something' that don't come from the provider
        {...props}
        createAuthUser={createAuthUser}
      />
    )}
  </ContextUserConsumer>
);

export default withRouter(LoginUpdate);
