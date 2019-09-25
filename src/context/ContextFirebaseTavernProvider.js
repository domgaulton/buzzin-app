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
      memberData: [],
      addToExistingTavern: (tavernName, pin, userId, userName) => this.handleAddToExistingTavern(tavernName, pin, userId, userName),
      createNewTavern: (name, pin, userId) => this.handleCreateNewTavern(name, pin, userId),
      setUserReady: (userId, bool) => this.handleSetUserReady(userId, bool),
      setMemberData: (tavernId) => this.handleSetMemberData(tavernId),
      setTavernData: (data) => this.handleSetTavernData(data),
      setCountdownActive: (data) => this.handlesetCountdownActive(data),
    };
  }

  handleAddToExistingTavern = (tavernName, pin, userId, userName) => {
    console.log(tavernName, pin);
    firestore.collection("taverns").where("name", "==", tavernName)
    .get()
    .then(function(data) {
      console.log(data)
      if (!data.empty) {
        data.forEach(function(doc) {
          firestore.collection("taverns").doc(doc.id).collection('members')
          .get()
          .then(data => {
            console.log(data.empty);
            // might not need to owrry about these being empty!
            if (data.empty) {
              firestore.collection("taverns").doc(doc.id).collection('members').doc(userId).set({
                name: userName,
                isReady: false,
              })
            } else {
              firestore.collection("taverns").doc(doc.id).collection('members').doc(userId).set({
                name: userName,
                isReady: false,
              })
            }
            firestore.collection("users").doc(userId).update({
              taverns: firebase.firestore.FieldValue.arrayUnion(doc.id)
            });
          })
        });
      }
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

  }

  handleCreateNewTavern = (name, pin, userId) => {
    firestore.collection("taverns").add({
      name: name,
      pin: pin,
      countdown: 30,
      countdownActive: false,
      admin: userId,
    })
    .then(docRef => {
      console.log(docRef.id)
      // Add this as an array item on tavernAdmin list
      firestore.collection("users").doc(userId).update({
        tavernAdmins: firebase.firestore.FieldValue.arrayUnion(docRef.id)
      });
      firestore.collection("taverns").doc(docRef.id).collection('members').doc(userId).set({
        name: name,
        isReady: false,
      })
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });
  }

  handleSetUserReady = (userId, bool) => {
    const userData = firestore.collection("taverns").doc(this.state.tavernId).collection('members').doc(userId);
    // const testData = firestore.collection("taverns").doc(this.state.tavernId).collection('members').doc(userId).get().then(doc => {return doc.data().isReady});
    // console.log(testData);
    return userData.update({
        isReady: bool
    })
    .then(() => {
        this.handleSetMemberData(this.state.tavernId);
    })
    .catch(function(error) {
        console.error("Error updating document: ", error);
    });
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

  handleSetMemberData = tavernId => {
    firestore.collection("taverns").doc(tavernId).collection("members")
    .get()
      .then(querySnapshot => {
        const data = querySnapshot.docs.map(doc => doc.data());
        this.setState({ memberData: data });
      });
  }

  handlesetCountdownActive = bool => {
    firestore.collection("taverns").doc(this.state.tavernId).update({
        countdownActive: bool
    })
    // .then(() => {
    //   console.log('done')
    // })
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

