import React, { Component } from 'react';
import { ContextConsumer } from "../context/ContextFirebaseProvider";
import { firestore } from "../base";

class TavernRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tavernName: '',
      membersList: [],
      members: [],
      membersReady: false,
    };
  }

  // TO DO - HOW DO WE GET THE EFFING MEMBERS!?
  componentDidMount(){
  // https://firebase.google.com/docs/firestore/query-data/listen
    firestore.collection("taverns").doc(this.props.tavernId)
      .onSnapshot({
        // Listen for document metadata changes
        includeMetadataChanges: true
      },(doc) => {
        const membersList = doc.data().members;
        this.setState({
          membersList
        })
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.membersList !== prevState.membersList ){
      this.state.membersList.forEach(item => {
        console.log(item);
        firestore.collection("users").doc(item)
          .onSnapshot({
            includeMetadataChanges: true
          },doc => {
            const memberObj = doc.data()
            console.log(doc.data())
            this.setState(prevState => ({
              members: [...prevState.members, memberObj]
            }))
          })
      })
    }

    if (this.state.members !== prevState.members) {
      const membersReady = this.state.members.every(item => {
        return item.isReady === true;
      })
      this.setState({
        membersReady
      })
    }
  }

  handleUserReady = e => {
    console.log('spread existing user data!');
    firestore.collection("users").doc(this.props.userId).update({
      isReady: true
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
  }

  createMembersList = array => {
    return (
      <ul className="test">
        {array.map(item => {
          return(
            <li key={item.name}>{item.name}, is {item.isReady ? 'ready' : 'not ready'}</li>
          );
        })}
      </ul>
    );
  }

  render(){
    return (
      <div>
        <h1>{this.props.tavernName}</h1>
        <button onClick={this.handleUserReady}>
          I'm Ready!
        </button>
        <p>Time limit: {this.props.countdown}</p>
        <p>Members are {this.state.membersReady ? '' : 'not'} ready!</p>
        {this.createMembersList(this.state.members)}
      </div>
    );
  };
}

const TavernRoomUpdate = props => (
  <ContextConsumer>
    {({ userId }) => (
      <TavernRoom
        {...props}
        userId={userId}
      />
    )}
  </ContextConsumer>
);

export default TavernRoomUpdate;
