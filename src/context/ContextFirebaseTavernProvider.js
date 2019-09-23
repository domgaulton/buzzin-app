import React, { Component } from 'react';
import { firestore } from "../base";

const Context = React.createContext();
export const ContextTavernConsumer = Context.Consumer;

class FirebaseTavernProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tavernId: '',
      tavernData: {},
      tavernMemberData: [],
      setUserReady: (userId, bool) => this.handleSetUserReady(userId, bool),
      setMemberData: (tavernId) => this.handleSetMemberData(tavernId),
      setTavernData: (data) => this.handleSetTavernData(data),
    };
  }

  handleSetUserReady = (userId, bool) => {
    firestore.collection("taverns").doc(this.state.tavernId).doc('member.id','==',userId).update({
      isReady: bool
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });

    // firestore.collection("taverns").where("members", "array-contains", this.state.userId).update({
    //   isReady: bool
    // })
    // .then(function(docRef) {
    //     console.log("Document written with ID: ", docRef.id);
    // })
    // .catch(function(error) {
    //     console.error("Error adding document: ", error);
    // });


    // firestore.collection("users").doc(this.state.userId).update({
    //   isReady: bool
    // })
    // .then(function(docRef) {
    //     console.log("Document written with ID: ", docRef.id);
    // })
    // .catch(function(error) {
    //     console.error("Error adding document: ", error);
    // });
  }

  handleSetTavernData = tavernId => {
    firestore.collection("taverns").doc(tavernId)
    .onSnapshot({
      includeMetadataChanges: true
    },(doc) => {
      const tavernData = doc.data();
      this.setState({
        tavernData,
      })
      this.setState({
        tavernId,
      })
    });

  }

  // setUserReady = (userId, bool) => {
  //   // console.log('setUserReady', userId, bool)
  //   // firestore.collection("taverns").doc(this.state.tavernId).collection("members").doc(userId).onSnapshot({
  //   //   includeMetadataChanges: true
  //   // },(doc) => {
  //   //   console.log(doc)
  //   // });

  //   consofirestore.collection("taverns").doc(this.state.tavernId).where('member.id','==',userId);
  // }

  handleSetMemberData = tavernId => {
    console.log('setTavernMembers')
    // firestore.collection("taverns").doc(tavernId).collection('members')
    // .get()
    // .then(data => {
    //   if (!data.empty) {
    //     data.forEach(doc => {
    //       console.log(doc.data())
    //     });
    //   }
    // })
    // .catch(function(error) {
    //   console.log("Error getting documents: ", error);
    // });
    firestore.collection("taverns").doc(tavernId).collection("members")
    .get()
    .then(data => {
      if (!data.empty) {
        data.forEach(doc => {
          this.setState(prevState => ({
            tavernMemberData: [...prevState.tavernMemberData, doc.data() ]
          }))
        });
      }
    })
    .catch(function(error) {
      console.log("Error getting documents: ", error);
    });
  }

  // handleSetTavernMemberData = (tavernId, userId, bool) => {
  //   console.log('setTavernMembers', tavernId, userId, bool)
  //   // firestore.collection("taverns").doc(tavernId).collection('members')
  //   // .get()
  //   // .then(data => {
  //   //   if (!data.empty) {
  //   //     data.forEach(doc => {
  //   //       console.log(doc.data())
  //   //     });
  //   //   }
  //   // })
  //   // .catch(function(error) {
  //   //   console.log("Error getting documents: ", error);
  //   // });
  //   firestore.collection("taverns").doc(tavernId).collection("members").doc(userId).onSnapshot({
  //     includeMetadataChanges: true
  //   },(doc) => {
  //     console.log(doc)
  //   });
  // }


  render(){
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    );
  }

}

export default FirebaseTavernProvider;

