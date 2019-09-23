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
    var washingtonRef = firestore.collection("taverns").doc(this.state.tavernId).collection('members').doc(userId);
    // Set the "capital" field of the city 'DC'
    return washingtonRef.update({
        isReady: bool
    })
    .then(() => {
        console.log("Document successfully updated!!!!!!!! set member data");
        this.handleSetMemberData(this.state.tavernId);
    })
    .catch(function(error) {
        console.error("Error updating document: ", error);
    });
  }

  handleSetTavernData = tavernId => {
    console.log('set tavern Data')
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

  handleSetMemberData = tavernId => {
    console.log('set member Data')
    firestore.collection("taverns").doc(tavernId).collection("members")
    .get()
      .then(querySnapshot => {
        const data = querySnapshot.docs.map(doc => doc.data());
        this.setState({ tavernMemberData: data });
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

