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

  // handleLoginEmailInputChange = e => {
  //   this.setState({
  //     loginEmail: e.currentTarget.value
  //   })
  // }

  // handleLoginPinInputChange = e => {
  //   this.setState({
  //     loginPin: e.currentTarget.value
  //   })
  // }

  handleInputChange(e) {
    console.log(e.target.name, e.target.value)
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleLogin = e => {
    e.preventDefault();
    this.props.loginUser(this.state.email, this.state.password)
    // console.log(this.state.loginEmail, this.state.loginPin)

    // const users = firestore.collection("users");
    // users.where("email", "==", this.state.loginEmail)
    // .get()
    // .then(data => {
    //   if (!data.empty) {
    //     data.forEach(doc => {
    //       if (doc.data().pin ===  Number(this.state.loginPin)) {
    //         this.props.setUserData(doc.id);
    //       } else {
    //         console.log('fail');
    //       }
    //     });
    //   }
    // })
    // .catch(function(error) {
    //   console.log("Error getting documents: ", error);
    // });
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
