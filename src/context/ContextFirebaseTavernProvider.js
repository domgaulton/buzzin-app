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
      addToExistingTavern: (tavernName, pin, userId, memberName) => this.handleAddToExistingTavern(tavernName, pin, userId, memberName),
      createNewTavern: (name, pin, userId, memberName) => this.handleCreateNewTavern(name, pin, userId, memberName),
      setUserReady: (userId, bool) => this.handleSetUserReady(userId, bool),
      setTavernData: (data) => this.handleSetTavernData(data),
      setCountdownActive: (data) => this.handlesetCountdownActive(data),
      getTavernData: (data) => this.handleGetTavernData(data),
      deleteTavern: (tavernId) => this.handleDeleteTavern(tavernId)
    };
  }

  handleDeleteTavern = tavernId => {
    const tavernDoc = firestore.collection("taverns").doc(tavernId);
    // store members to delete later
    const tavernMembers = tavernDoc.get().then(response => {
      console.log(response);
      if (!response.empty && response.data().members) {
        response.data().members.forEach(item => {
          console.log(item.id);
          firestore.collection("users").doc(item.id).update({
              taverns: firebase.firestore.FieldValue.arrayRemove(tavernId)
          });
        })
      }

      tavernDoc.delete().then(function() {
        console.log("Document successfully deleted!");
      }).catch(function(error) {
        console.error("Error removing document: ", error);
      });

    });
  }

  handleAddToExistingTavern = (tavernName, pin, userId, memberName) => {
    console.log(tavernName, pin);
    firestore.collection("taverns").where("name", "==", tavernName)
    .get()
    .then(function(data) {
      console.log(data)
      if (!data.empty) {
        data.forEach(function(doc) {
          console.log(doc);
          firestore.collection("taverns").doc(doc.id).update({
              members: firebase.firestore.FieldValue.arrayUnion({
                isReady: false,
                id: userId,
              })
          });

          firestore.collection("users").doc(userId).update({
            taverns: firebase.firestore.FieldValue.arrayUnion(doc.id)
          });
        });
      }
    })
    .catch(function(error) {
      console.log("Error getting documents: ", error);
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

  handleCreateNewTavern = (name, pin, userId, memberName) => {
    firestore.collection("taverns").add({
      name: name,
      pin: pin,
      countdown: 30,
      countdownActive: false,
      admin: userId,
    })
    .then(docRef => {
      // Add this as an array item on tavernAdmin list
      firestore.collection("users").doc(userId).update({
        taverns: firebase.firestore.FieldValue.arrayUnion(docRef.id)
      });
      firestore.collection("taverns").doc(docRef.id).update({
        members: firebase.firestore.FieldValue.arrayUnion({
          isReady: false,
          id: userId,
        })
      });
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });
  }

  handleSetUserReady = (userId, bool) => {
    let newMembers = []
    firestore.collection("taverns").doc(this.state.tavernId)
    .get()
    .then(data => {
      let members = data.data().members;
      // create a temp array to set whole member data later
      newMembers = members
      newMembers.map(doc => {
        if (doc.id === userId) {
          doc.isReady = bool;
          return doc.isReady;
        } else {
          return doc;
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

  handleSetTavernData = tavernId => {
    this.setState({
      tavernId,
    })
    firestore.collection("taverns").doc(tavernId)
    .onSnapshot({
      includeMetadataChanges: true
    },(doc) => {
      const tavernData = doc.data();
      this.setState({
        tavernData,
      })
    });

  }

  handlesetCountdownActive = bool => {
    firestore.collection("taverns").doc(this.state.tavernId).update({
        countdownActive: bool
    })
    .catch(function(error) {
        console.error("Error updating document: ", error);
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

export default FirebaseTavernProvider;
