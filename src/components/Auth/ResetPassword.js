import React, { Component } from 'react';
import { ContextUserConsumer } from "../../context/ContextFirebaseUserProvider";
import { withRouter } from 'react-router-dom';

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
    };
  }

  handleInputChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.resetPassword(this.state.email);
    this.setState({
      email: '',
    })
  }

  render(){
    return (
      <div className="container">
        <h1>Reset Password</h1>
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
            className="buzzin-form__item buzzin-form__item--submit"
            type='submit'
            id="sign-in-button"
            value='Reset Password'
            disabled={this.state.email === ''}
          />
        </form>
        <p onClick={() => this.props.changeLoginMethod('loginEmail')}>Back to login</p>
      </div>
    );
  }
}

const ResetPasswordUpdate = (props) => (
  <ContextUserConsumer>
    {({ userLoggedIn, userId, setUserData, loginUser, createAuthUser, resetPassword, phoneLogin }) => (
      <ResetPassword
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

export default withRouter(ResetPasswordUpdate);
