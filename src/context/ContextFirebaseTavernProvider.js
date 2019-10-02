import React, { Component } from 'react';
import { firestore } from "../base";
import * as firebase from "firebase/app";

const Context = React.createContext();
export const ContextTavernConsumer = Context.Consumer;

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
      setCountdownActive: (data) => this.handlesetCountdownActive(data),
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
    firestore.collection("taverns").doc(tavernId)
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
    const tavern = firestore.collection("taverns").doc(tavernId);
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
    firestore.collection("taverns").add({
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
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });
  }

  handleAddToExistingTavern = (tavernName, pin, userId, memberName) => {
    // console.log(tavernName, pin);
    firestore.collection("taverns").where("name", "==", tavernName)
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
            return
            //console.log('user exists')
          }
        });
      }
    })
    .catch(function(error) {
      console.log("Error getting documents: ", error);
    });
  }

  // // // // // //
  // Tavern Room Functionality
  // // // // // //

  handleSetUserReady = (userId, bool) => {
    let newMembers = []
    firestore.collection("taverns").doc(this.state.tavernId)
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
      firestore.collection("taverns").doc(this.state.tavernId).update({
        members: newMembers
      });
    })
  }

  handlesetCountdownActive = bool => {
    firestore.collection("taverns").doc(this.state.tavernId).update({
      countdownActive: bool
    })
    .catch(function(error) {
      console.error("Error updating document: ", error);
    });
  }

  handleResetUsersNotReady = tavernId => {
    const tavernDoc = firestore.collection("taverns").doc(tavernId);
    tavernDoc.get().then(response => {
      if (!response.empty && response.data().members) {
        response.data().members.forEach(item => {
          this.handleSetUserReady(item.id, false)
        })
      }
    });
  }

  handleUserBuzzedIn = userId => {
    const tavernDoc = firestore.collection("taverns").doc(this.state.tavernId);
    tavernDoc.update({
      buzzedIn: userId,
      countdownActive: false,
    });
  }

  handleUserAnswered = (correct, userId, score) => {
    if (correct){
      console.log('correct - handle score')
    }
    const tavernDoc = firestore.collection("taverns").doc(this.state.tavernId);
    tavernDoc.update({
      buzzedIn: '',
    });
  }

  // // // // // //
  // Settings
  // // // // // //

  handleDeleteTavern = tavernId => {
    const tavernDoc = firestore.collection("taverns").doc(tavernId);
    // store members to delete later
    tavernDoc.get().then(response => {
      if (!response.empty && response.data().members) {
        response.data().members.forEach(item => {
          this.updateUserTaverns('remove', item.id, tavernId);
        })
      }

      tavernDoc.delete().then(function() {
        console.log("Document successfully deleted!");
      }).catch(function(error) {
        console.error("Error removing document: ", error);
      });

    });
  }

  // // // // // //
  // Global Functions
  // // // // // //

  updateTavernMembers = (task, tavernId, userId)  => {
    // only do something current if we are adding a user
    if (task === 'add') {
      firestore.collection("taverns").doc(tavernId).update({
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
      firestore.collection("users").doc(userId).update({
        taverns: firebase.firestore.FieldValue.arrayUnion(tavernId)
      });
    } else if (task === 'remove') {
      firestore.collection("users").doc(userId).update({
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

export default FirebaseTavernProvider;
