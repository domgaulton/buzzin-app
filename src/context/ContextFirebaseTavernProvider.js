import React, { Component } from 'react';
import { firestore } from "../base";
import * as firebase from "firebase/app";
import { ContextMessageConsumer } from './ContextMessageProvider';

const Context = React.createContext();
export const ContextTavernConsumer = Context.Consumer;

const tavernsCollection = process.env.REACT_APP_FIREBASE_TAVERNS_COLLECTION;
const usersCollection = process.env.REACT_APP_FIREBASE_USERS_COLLECTION;

class FirebaseTavernProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tavernId: '',
      tavernData: {},

      // Tavern Data
      setTavernData: (data) => this.handleSetTavernData(data),
      getTavernData: (data) => this.handleGetTavernData(data),

      // Update / New Taverns
      createNewTavern: (name, pin, userId, memberName) => this.handleCreateNewTavern(name, pin, userId, memberName),
      addToExistingTavern: (tavernName, pin, userId, memberName) => this.handleAddToExistingTavern(tavernName, pin, userId, memberName),

      // Tavern Room Functionality
      setUserReady: (userId, bool) => this.handleSetUserReady(userId, bool),
      setCountdownActive: (data) => this.handleSetCountdownActive(data),
      resetUsersNotReady: (tavernId) => this.handleResetUsersNotReady(tavernId),
      userBuzzedIn: (userId) => this.handleUserBuzzedIn(userId),
      userAnswered: (correct, userId, score) => this.handleUserAnswered(correct, userId, score),

      // Settings
      deleteTavern: (tavernId) => this.handleDeleteTavern(tavernId),
    };
  }

  // // // // // //
  // Tavern Data
  // // // // // //

  handleSetTavernData = tavernId => {
    this.setState({
      tavernId,
    })
    firestore.collection(tavernsCollection).doc(tavernId)
    .onSnapshot({
      includeMetadataChanges: true
    },(response) => {
      const tavernData = response.data();
      this.setState({
        tavernData,
      })
    });
  }

  async handleGetTavernData(tavernId) {
    let data = {}
    const tavern = firestore.collection(tavernsCollection).doc(tavernId);
    await tavern.get()
    .then(response => {
      data = response.data();
    })
    return data;
  }

  // // // // // //
  // Update / New Taverns
  // // // // // //

  handleCreateNewTavern = (name, pin, userId, memberName) => {
    firestore.collection(tavernsCollection).add({
      name: name,
      pin: pin,
      countdown: 30,
      countdownActive: false,
      admin: userId,
      buzzedIn: '',
    })
    .then(response => {
      // Add this as an array item on tavernAdmin list
      this.updateUserTaverns('add', userId, response.id);
      this.updateTavernMembers('add', response.id, userId);
    })
    .catch(error => {
      this.props.addMessage(error);
    });
  }

  handleAddToExistingTavern = (tavernName, pin, userId, memberName) => {
    // console.log(tavernName, pin);
    firestore.collection(tavernsCollection).where("name", "==", tavernName)
    .get()
    .then(query => {
      // if tavern exists
      if (!query.empty) {
        query.forEach(response => {
          // if user exists in tavern listing already do nothing
          const userExists = response.data().members.some(member => member.id === userId)
          if (!userExists) {
            this.updateUserTaverns('add', userId, response.id);
            this.updateTavernMembers('add', response.id, userId);
          } else {
            this.props.addMessage("You're already in this tavern!");
            return
          }
        });
      }
    })
    .catch(error => {
      this.props.addMessage(error);
    });
  }

  // // // // // //
  // Tavern Room Functionality
  // // // // // //

  handleSetUserReady = (userId, bool) => {
    let newMembers = []
    firestore.collection(tavernsCollection).doc(this.state.tavernId)
    .get()
    .then(response => {
      let members = response.data().members;
      // create a temp array to set whole member data later
      newMembers = members
      newMembers.map(member => {
        if (member.id === userId) {
          member.isReady = bool;
          return member.isReady;
        } else {
          return member;
        }
      });
    })
    .then(() => {
      // set the member data from temp above!
      firestore.collection(tavernsCollection).doc(this.state.tavernId).update({
        members: newMembers
      });
    })
  }

  handleSetCountdownActive = bool => {
    firestore.collection(tavernsCollection).doc(this.state.tavernId).update({
      countdownActive: bool,
      buzzedIn: '',
    })
    .catch(error => {
      this.props.addMessage(error);
    });
  }

  handleResetUsersNotReady = tavernId => {
    const tavernDoc = firestore.collection(tavernsCollection).doc(tavernId);
    tavernDoc.get().then(response => {
      if (!response.empty && response.data().members) {
        response.data().members.forEach(item => {
          this.handleSetUserReady(item.id, false)
        })
      }
    });
  }

  handleUserBuzzedIn = userId => {
    const tavernDoc = firestore.collection(tavernsCollection).doc(this.state.tavernId);
    tavernDoc.update({
      buzzedIn: userId,
    });
  }

  handleUserAnswered = (correct, userId, score) => {
    const tavernDoc = firestore.collection(tavernsCollection).doc(this.state.tavernId);
    tavernDoc.update({
      buzzedIn: '',
    });
    if (correct === 'true'){
      tavernDoc.update({
        countdownActive: false,
      });
      this.props.addMessage('Answered Correct!');
      // also set everyone to not ready!
    }
  }

  // // // // // //
  // Settings
  // // // // // //

  handleDeleteTavern = tavernId => {
    const tavernDoc = firestore.collection(tavernsCollection).doc(tavernId);
    // store members to delete later
    tavernDoc.get().then(response => {
      if (!response.empty && response.data().members) {
        response.data().members.forEach(item => {
          this.updateUserTaverns('remove', item.id, tavernId);
        })
      }

      tavernDoc.delete().then(function() {
        console.log("Document successfully deleted!");
      }).catch(error => {
        this.props.addMessage(error);
      });

    });
  }

  // // // // // //
  // Global Functions
  // // // // // //

  updateTavernMembers = (task, tavernId, userId)  => {
    // only do something current if we are adding a user
    if (task === 'add') {
      firestore.collection(tavernsCollection).doc(tavernId).update({
        members: firebase.firestore.FieldValue.arrayUnion({
          isReady: false,
          id: userId,
        })
      });
    } else {
      return;
    }
  }

  updateUserTaverns = (task, userId, tavernId) => {
    if (task === 'add') {
      firestore.collection(usersCollection).doc(userId).update({
        taverns: firebase.firestore.FieldValue.arrayUnion(tavernId)
      });
    } else if (task === 'remove') {
      firestore.collection(usersCollection).doc(userId).update({
        taverns: firebase.firestore.FieldValue.arrayRemove(tavernId)
      });
    }
  }

  render(){
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

const FirebaseTavernProviderUpdate = props => (
  <ContextMessageConsumer>
    {({ addMessage }) => (
      <FirebaseTavernProvider
        // remember to spread the existing props otherwise you lose any new ones e.g. 'something' that don't come from the provider
        {...props}
        addMessage={addMessage}
      />
    )}
  </ContextMessageConsumer>
);

export default FirebaseTavernProviderUpdate;
