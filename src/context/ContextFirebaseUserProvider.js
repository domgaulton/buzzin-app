import React, { Component } from 'react';
import { firestore, auth } from "../base";
// import * as firebase from "firebase/app";

const Context = React.createContext();
export const ContextUserConsumer = Context.Consumer;

class FirebaseUserProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: '',
      userData: {},
      userLoggedIn: false,

      // Auth
      loginUser: (email, password) => this.handleLoginUser(email, password),
      createAuthUser: (email, password, name) => this.handleCreateAuthUser(email, password, name),
      logoutUser: () => this.handleLogoutUser(),
      deleteUser: (userId) => this.handleDeleteUser(userId),

      // Set User Data
      getUserData: (data) => this.handleGetUserData(data),
      setUserData: (data) => this.handleSetUserData(data),

      // Settings
      resetPassword: (email) => this.handleResetPassword(email),
    };
  }

  componentDidMount(){
    auth.onAuthStateChanged(user => {
      if (user) {
        this.handleSetUserData(user.uid)
      } else {
        // No user is signed in.
        this.setState({
          userLoggedIn: false,
        })
      }
    });
  }

  // // // // // //
  // Auth
  // // // // // //

  handleLoginUser = (email, password) => {
    auth.signInWithEmailAndPassword(email, password)
    .then(response => {
      this.handleSetUserData(response.user.uid)
    })
    .catch(function(error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage)
      // ...
    });
  }

  handleCreateAuthUser = (email, password, name) => {
    auth.createUserWithEmailAndPassword(email, password)
    .then(response => {
      this.setState({
        userId: response.user.uid
      })
      this.handleCreateDatabaseUser(response.user.uid, name)
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

  handleLogoutUser = () => {
    auth.signOut()
    .then(() => {
      this.setState({
        userLoggedIn: false,
        userId: '',
      })
    }).catch(function(error) {
      // An error happened.
      console.log(error)
    });
  }

  handleDeleteUser = userId => {
    let newMembers = [];
    const userDoc = firestore.collection("users").doc(userId);
    userDoc.get()
    .then(response => {
      if (response.exists && response.data().taverns) {
        // Go through each tavern you're a member of and delete trace!
        response.data().taverns.forEach(item => {
          // console.log(item);
          firestore.collection("taverns").doc(item).get().then(response => {
            const members = response.data().members;
            if (members) {
              newMembers = members.filter(item => item.id !== userId);
              firestore.collection("taverns").doc(item).update({
                members: newMembers
              })
            }

          })
        })
      }
    })
    .then(() => {
      //Find taverns where user is admin member
      firestore.collection("taverns").where("admin", "==", userId)
      .get()
      .then(function(query) {
        // console.log(data)
        if (!query.empty) {
          query.forEach(function(response) {
            // console.log(doc);
            firestore.collection("taverns").doc(response.id).delete().then(function() {
              // console.log("Document successfully deleted!");
            }).catch(function(error) {
              console.error("Error removing document: ", error);
            });
          });
        }
      })
    })
    .then(() => {
      //Finally delete the user
      userDoc.delete().then(function() {
        // console.log("Document successfully deleted!");
        const user = auth.currentUser;
        user.delete().then(function() {
          //user deleted
        }).catch(function(error) {
          // An error happened.
          console.log(error);
        });
      }).catch(function(error) {
        console.error("Error removing document: ", error);
      });
    })
    .then(() => {
      this.setState({
        userLoggedIn: false,
        userId: '',
      })
    })
  }

  // // // // // //
  // Set User Data
  // // // // // //


  async handleGetUserData(userId) {
    let data = {}
    const users = firestore.collection("users").doc(userId);
    await users.get()
    .then(response => {
      data = response.data();
    })
    return data;
  }

  handleSetUserData = userId => {
    this.setState({
      userId: userId
    })
    firestore.collection("users").doc(userId)
    .onSnapshot({
      includeMetadataChanges: true
    },(response) => {
      const userData = response.data();
      this.setState({
        userData,
        userLoggedIn: true,
      })
    });
  }

  // // // // // //
  // Settings
  // // // // // //

  handleResetPassword = email => {
    auth.sendPasswordResetEmail(email).then(function() {
      // Email sent.
    }).catch(function(error) {
      // An error happened.
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

