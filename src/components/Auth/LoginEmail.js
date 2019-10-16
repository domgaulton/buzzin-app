import React, { Component } from 'react';
import { ContextUserConsumer } from "../../context/ContextFirebaseUserProvider";
import { withRouter } from 'react-router-dom';

class LoginEmail extends Component {
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

  handleSubmit = e => {
    e.preventDefault();
    this.props.loginUser(this.state.email, this.state.password);
    this.setState({
      email: '',
      password: '',
    })
  }

  render(){
    return (
      <div className="container">
        <h1>Login</h1>
         <form
          onSubmit={e => this.handleSubmit(e)}
          className="buzzin-form"
        >
          <input
            className="buzzin-form__item buzzin-form__item--text-input"
            type='phone'
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
            value={'Login'}
            disabled={this.state.email === ''}
          />
        </form>
        <p onClick={() => this.props.changeLoginMethod('registerEmail')}>No login? Register here</p>
        <p onClick={() => this.props.changeLoginMethod('resetPassword')}>Forgot Password - Reset Here</p>
      </div>
    );
  }
}

const LoginEmailUpdate = (props) => (
  <ContextUserConsumer>
    {({ loginUser }) => (
      <LoginEmail
        // remember to spread the existing props otherwise you lose any new ones e.g. 'something' that don't come from the provider
        {...props}
        loginUser={loginUser}
      />
    )}
  </ContextUserConsumer>
);

export default withRouter(LoginEmailUpdate);
