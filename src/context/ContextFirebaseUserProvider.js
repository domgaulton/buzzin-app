import React, { Component } from 'react';
import { firestore, auth } from "../base";
// import * as firebase from "firebase/app";
import { ContextMessageConsumer } from './ContextMessageProvider';

const Context = React.createContext();
export const ContextUserConsumer = Context.Consumer;

const tavernsCollection = process.env.REACT_APP_FIREBASE_TAVERNS_COLLECTION;
const usersCollection = process.env.REACT_APP_FIREBASE_USERS_COLLECTION;

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
    .catch(error => {
      const errorMessage = error.message;
      this.props.addMessage(errorMessage)
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
    .catch(error => {
      const errorMessage = error.message;
      this.props.addMessage(errorMessage);
    });
  }

  handleCreateDatabaseUser = (userId, name) => {
    firestore.collection(usersCollection).doc(userId).set({
      name: name,
    })
    .then(() => {
      this.handleSetUserData(userId);
    })
    .catch(error => {
      // console.error("Error writing document: ", error);
      this.props.addMessage(error);
    });
  }

  handleLogoutUser = () => {
    auth.signOut()
    .then(() => {
      this.setState({
        userLoggedIn: false,
        userId: '',
      })
    }).catch(error => {
      // An error happened.
      this.props.addMessage(error);
    });
  }

  handleDeleteUser = userId => {
    let newMembers = [];
    const userDoc = firestore.collection(usersCollection).doc(userId);
    userDoc.get()
    .then(response => {
      if (response.exists && response.data().taverns) {
        // Go through each tavern you're a member of and delete trace!
        response.data().taverns.forEach(item => {
          // console.log(item);
          firestore.collection(tavernsCollection).doc(item).get().then(response => {
            const members = response.data().members;
            if (members) {
              newMembers = members.filter(item => item.id !== userId);
              firestore.collection(tavernsCollection).doc(item).update({
                members: newMembers
              })
            }

          })
        })
      }
    })
    .then(() => {
      //Find taverns where user is admin member
      firestore.collection(tavernsCollection).where("admin", "==", userId)
      .get()
      .then(function(query) {
        // console.log(data)
        if (!query.empty) {
          query.forEach(function(response) {
            // console.log(doc);
            firestore.collection(tavernsCollection).doc(response.id).delete().then(function() {
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
    const users = firestore.collection(usersCollection).doc(userId);
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
    firestore.collection(usersCollection).doc(userId)
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
    }).catch(error => {
      this.props.addMessage(error);
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

// export default FirebaseUserProvider;

const FirebaseUserProviderUpdate = props => (
  <ContextMessageConsumer>
    {({ addMessage }) => (
      <FirebaseUserProvider
        // remember to spread the existing props otherwise you lose any new ones e.g. 'something' that don't come from the provider
        {...props}
        addMessage={addMessage}
      />
    )}
  </ContextMessageConsumer>
);

export default FirebaseUserProviderUpdate;


