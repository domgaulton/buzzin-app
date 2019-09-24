import React, { Component } from 'react';
import { firestore, auth } from "../base";

const Context = React.createContext();
export const ContextUserConsumer = Context.Consumer;

class FirebaseUserProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: '',
      userData: {},
      userLoggedIn: false,
      setUserData: (data) => this.handleSetUserData(data),
      loginUser: (email, password) => this.handleLoginUser(email, password),
    };
  }

  componentDidMount(){
    if ( localStorage.getItem("buzzinApp") ) {
      this.handleSetUserData(localStorage.getItem("buzzinApp"))
    }
  }

  handleLoginUser = (email, password) => {
    auth.signInWithEmailAndPassword(email, password)
    .then(function(data) {
      console.log(data.user.uid);
    })
    .catch(function(error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage)
      // ...
    });
  }

  handleSetUserData = userId => {
    firestore.collection("users").doc(userId)
    .onSnapshot({
      includeMetadataChanges: true
    },(doc) => {
      const userId = doc.id
      const userData = doc.data();
      this.setState({
        userData,
      })
      this.setState({
        userId,
      })
      this.setState({
        userLoggedIn: true,
      })
      localStorage.setItem("buzzinApp", userId);
    });
  }


  render(){
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    );
  }

}

export default FirebaseUserProvider;

