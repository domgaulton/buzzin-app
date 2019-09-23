import React, { Component } from 'react';
import { firestore } from "../base";

const Context = React.createContext();
export const ContextUserConsumer = Context.Consumer;

class FirebaseUserProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: '',
      userData: {},
      userLoggedIn: false,
      //setUserReady: (bool) => this.handleSetUserReady(bool),
      setUserData: (data) => this.handleSetUserData(data),
    };
  }

  componentDidMount(){
    if ( localStorage.getItem("buzzinApp") ) {
      this.handleSetUserData(localStorage.getItem("buzzinApp"))
    }
  }

  // handleSetUserReady = (tavernId, bool) => {
  //   firestore.collection("taverns").doc(tavernId).collection('members').where('members', '==', this.state.userId).update({
  //     isReady: bool
  //   })
  //   .then(function(docRef) {
  //       console.log("Document written with ID: ", docRef.id);
  //   })
  //   .catch(function(error) {
  //       console.error("Error adding document: ", error);
  //   });

  //   // firestore.collection("taverns").where("members", "array-contains", this.state.userId).update({
  //   //   isReady: bool
  //   // })
  //   // .then(function(docRef) {
  //   //     console.log("Document written with ID: ", docRef.id);
  //   // })
  //   // .catch(function(error) {
  //   //     console.error("Error adding document: ", error);
  //   // });


  //   // firestore.collection("users").doc(this.state.userId).update({
  //   //   isReady: bool
  //   // })
  //   // .then(function(docRef) {
  //   //     console.log("Document written with ID: ", docRef.id);
  //   // })
  //   // .catch(function(error) {
  //   //     console.error("Error adding document: ", error);
  //   // });
  // }

  handleSetUserData = userId => {
    // console.log(userId)
    firestore.collection("users").doc(userId)
    .onSnapshot({
      includeMetadataChanges: true
    },(doc) => {
      const userId = doc.id
      const userData = doc.data();
      this.setState({
        userData,
      })
      this.setState({
        userId,
      })
      this.setState({
        userLoggedIn: true,
      })
      localStorage.setItem("buzzinApp", userId);
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

