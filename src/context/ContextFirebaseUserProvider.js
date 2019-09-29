import React, { Component } from 'react';
import { firestore, auth } from "../base";
import { withRouter } from 'react-router-dom';

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
      console.log(user)
      if (user) {
        this.setState({
          userLoggedIn: true,
        })
        this.setState({
          userId: user.uid,
        })
        this.handleSetUserData(user.uid)
      } else {
        // No user is signed in.
        this.setState({
          userLoggedIn: false,
        })
      }
    });
  }

  // componentDidUpdate(prevProps, prevState){
  //   if (this.state.userLoggedIn !== prevState.userLoggedIn){
  //     auth.onAuthStateChanged(user => {
  //       console.log(user)
  //       if (user) {
  //         this.setState({
  //           userId: user.uid,
  //         })
  //         this.handleSetUserData(user.uid)
  //       } else {
  //         // No user is signed in.
  //         this.setState({
  //           userLoggedIn: false,
  //         })
  //       }
  //     });
  //   }
  // }

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
      console.log(data)
      this.setState({
        userId: data.user.uid,
        userLoggedIn: true,
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
      this.setState({
        userLoggedIn: false,
        userId: '',
      })
      // this.props.history.push('/new-location')
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
      console.log(doc.data())
      const userData = doc.data();
      this.setState({
        userData,
      })
      // this.props.history.push(`/user/${userId}`);
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

