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
      setUserData: (data) => this.handleSetUserData(data),
      loginUser: (email, password) => this.handleLoginUser(email, password),
      createAuthUser: (email, password, name) => this.handleCreateAuthUser(email, password, name),
      logoutUser: () => this.handleLogoutUser(),
      getUserData: (data) => this.handleGetUserData(data),
      deleteUser: (userId) => this.handleDeleteUser(userId),
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

  handleResetPassword = email => {
    auth.sendPasswordResetEmail(email).then(function() {
      // Email sent.
    }).catch(function(error) {
      // An error happened.
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
      .then(function(data) {
        // console.log(data)
        if (!data.empty) {
          data.forEach(function(doc) {
            // console.log(doc);
            firestore.collection("taverns").doc(doc.id).delete().then(function() {
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

  async handleGetUserData(userId) {
    let data = {}
    const users = firestore.collection("users").doc(userId);
    await users.get()
    .then(response => {
      data = response.data();
    })
    return data;
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
      this.setState({
        userLoggedIn: false,
        userId: '',
      })
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

