import React, { Component } from 'react';
import { firestore, auth } from "../base";
import { Redirect } from 'react-router-dom';

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
      createAuthUser: (email, password, name) => this.handleCreateAuthUser(email, password, name),
      logoutUser: () => this.handleLogoutUser(),
    };
  }

  componentDidMount(){
    auth.onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        // console.log('signed in', user)
        // this.handleSetUserData(user.uid)
        this.setState({
          userLoggedIn: true,
        })
      } else {
        // No user is signed in.
        console.log('signed out!!!!');
        this.setState({
          userLoggedIn: false,
        })
      }
    });
  }

  handleCreateAuthUser = (email, password, name) => {
    auth.createUserWithEmailAndPassword(email, password)
    .then(data => {
      this.setState({
        userId: data.user.uid
      })
      this.handleCreateDatabaseUser(data.user.uid, name)
    })
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage)
      // ...
    });
  }

  handleCreateDatabaseUser = (userId, name) => {
    firestore.collection("users").doc(userId).set({
      name: name,
    })
    .then(() => {
      this.handleSetUserData(userId);
      console.log("Document successfully written!");
    })
    .catch(function(error) {
      console.error("Error writing document: ", error);
    });
  }

  handleLoginUser = (email, password) => {
    auth.signInWithEmailAndPassword(email, password)
    .then(data => {
      this.setState({
        userId: data.user.uid
      })
      this.handleSetUserData(data.user.uid)
    })
    .catch(function(error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage)
      // ...
    });
  }

  handleLogoutUser = () => {
    auth.signOut()
    .then(() => {
      // Sign-out successful.
      // console.log('signed out!')
    }).catch(function(error) {
      // An error happened.
      console.log(error)
    });
  }

  handleSetUserData = userId => {
    this.setState({
      userId: userId
    })
    firestore.collection("users").doc(userId)
    .onSnapshot({
      includeMetadataChanges: true
    },(doc) => {
      const userData = doc.data();
      this.setState({
        userData,
      })
      // console.log(userData)
      this.setState({
        userLoggedIn: true,
      })
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

