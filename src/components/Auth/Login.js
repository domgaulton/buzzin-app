import React, { Component } from 'react';
import { ContextUserConsumer } from "../../context/ContextFirebaseUserProvider";
import { withRouter } from 'react-router-dom';
import LoginPhone from './LoginPhone';
import LoginEmail from './LoginEmail';
import RegisterEmail from './RegisterEmail';
import ResetPassword from './ResetPassword';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginFormShowing: true,
      resetPassword: false,
      loginRegisterMethod: '',
      phoneLogin: false,
      email: '',
      password: '',
      createName: '',
      createEmail: '',
      createPassword: '',
    };
  }

  handleLoginMethod = input => {
    this.setState({
      loginRegisterMethod: input
    })
  }

  // handleInputChange(e) {
  //   this.setState({
  //     [e.target.name]: e.target.value,
  //   });
  // }

  // resetPassword = e => {
  //   this.setState({
  //     resetPassword: !this.state.resetPassword
  //   })
  // }


  // handleSubmit = e => {
  //   e.preventDefault();
  //   if (this.state.resetPassword) {
  //     this.props.phoneLogin(this.state.email, document.querySelector('#sign-in-button'));
  //     this.setState({
  //       email: '',
  //       password: '',
  //       resetPassword: false,
  //     })
  //   } else {
  //     this.props.loginUser(this.state.email, this.state.password);
  //     this.setState({
  //       email: '',
  //       password: '',
  //     })
  //   }
  // }

  // handleCreateUser = e => {
  //   e.preventDefault();
  //   this.props.createAuthUser(this.state.createEmail, this.state.createPassword, this.state.createName)
  // }

  loginMethod = loginRegisterState => {
    // console.log(loginRegisterState)
    switch(loginRegisterState) {
      case 'loginEmail':
        return <LoginEmail changeLoginMethod={this.handleLoginMethod} />
      case 'registerEmail':
        return <RegisterEmail changeLoginMethod={this.handleLoginMethod} />
      case 'resetPassword':
        return <ResetPassword changeLoginMethod={this.handleLoginMethod} />
      case 'loginPhone':
        return <LoginPhone changeLoginMethod={this.handleLoginMethod} />
      default :
        return <LoginEmail changeLoginMethod={this.handleLoginMethod} />
    }
  }

  render(){
    return (
      <div className="container">
        {this.loginMethod(this.state.loginRegisterMethod)}
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
