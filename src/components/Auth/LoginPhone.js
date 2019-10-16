import React, { Component } from 'react';
import { ContextUserConsumer } from "../../context/ContextFirebaseUserProvider";
import { withRouter } from 'react-router-dom';
import * as firebase from "firebase/app";

class LoginPhone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      phone: '',
      code: '',
      phoneNumberSent: false,
    };
  }

  componentDidMount() {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
      'size': 'invisible',
      'callback': response => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        this.setState({
          phoneNumberSent: true,
        })
        this.props.phoneLogin(this.state.phone);
      }
    });
  }

  handleInputChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    if (!this.state.phoneNumberSent) {
      console.log('restier')
      this.props.phoneLogin(this.state.phone);
    } else {
      console.log('confirm')
      this.props.phoneConfirm(this.state.code)
    }

  }

  render(){
    return (
      <div className="container">
        <h1>Phone Login</h1>
         <form
          onSubmit={e => this.handleSubmit(e)}
          className="buzzin-form"
        >
          <input
            className="buzzin-form__item buzzin-form__item--text-input"
            type='text'
            placeholder='Enter your name'
            name="name"
            value={this.state.name}
            onChange={e => this.handleInputChange(e)}
          />
          <input
            className="buzzin-form__item buzzin-form__item--text-input"
            type='phone'
            placeholder='Phone Number'
            name="phone"
            value={this.state.phone}
            onChange={e => this.handleInputChange(e)}
          />
          {this.state.phoneNumberSent ? (
            <input
              className="buzzin-form__item buzzin-form__item--text-input"
              type='text'
              placeholder='Enter The Code'
              name="code"
              value={this.state.code}
              onChange={e => this.handleInputChange(e)}
            />
          ) : null }
          <input
            className="buzzin-form__item buzzin-form__item--submit"
            type='submit'
            id={!this.state.phoneNumberSent ? 'sign-in-button' : null}
            value={!this.state.phoneNumberSent ? 'Send Code' : 'Submit Code'}
            disabled={this.state.phone === ''}
          />
        </form>
      </div>
    );
  }
}

const LoginPhoneUpdate = (props) => (
  <ContextUserConsumer>
    {({ phoneLogin, phoneConfirm }) => (
      <LoginPhone
        // remember to spread the existing props otherwise you lose any new ones e.g. 'something' that don't come from the provider
        {...props}
        phoneLogin={phoneLogin}
        phoneConfirm={phoneConfirm}
      />
    )}
  </ContextUserConsumer>
);

export default withRouter(LoginPhoneUpdate);
