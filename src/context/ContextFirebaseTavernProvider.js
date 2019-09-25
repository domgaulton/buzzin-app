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
      createNewTavern: (name, pin, userId) => this.handleCreateNewTavern(name, pin, userId),
      setUserReady: (userId, bool) => this.handleSetUserReady(userId, bool),
      setMemberData: (tavernId) => this.handleSetMemberData(tavernId),
      setTavernData: (data) => this.handleSetTavernData(data),
      setCountdownActive: (data) => this.handlesetCountdownActive(data),
    };
  }

  handleCreateNewTavern = (name, pin, userId) => {
    firestore.collection("taverns").add({
      name: name,
      pin: pin,
      countdown: 30,
      admin: userId,
    })
    .then(docRef => {
      // Add this as an array item on tavernAdmin list
      firestore.collection("users").doc(userId).update({
          tavernAdmins: firebase.firestore.FieldValue.arrayUnion(docRef.id)
      });
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
    const tavernData = firestore.collection("taverns").doc(this.state.tavernId);
    return tavernData.update({
        countdownActive: bool
    })
    .then(() => {
      console.log('done')
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

