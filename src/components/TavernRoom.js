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

  // createMembersList = array => {
  //   return (
  //     <ul className="test">
  //       {array.map(item => {
  //         firestore.collection("users").doc(item)
  //         .onSnapshot({
  //           includeMetadataChanges: true
  //         },doc => {
  //           console.log(doc.data());
  //           return(
  //             <li key={doc.data().name}>{doc.data().name}, is {doc.data().isReady ? 'ready' : 'not ready'}</li>
  //           );
  //         })
  //       })}
  //     </ul>
  //   );
  // }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.membersList !== prevState.membersList ){
      // console.log('members list changed');
      // let tempMembersList = []
      this.state.membersList.map(item => {
        // console.log(item);
        firestore.collection("users").doc(item)
          .onSnapshot({
            includeMetadataChanges: true
          },doc => {
            // const memberObj = doc.data();
            // tempMembersList.push(memberObj)
            // console.log(doc.data())
            this.setState(prevState => ({
              members: [...prevState.members, doc.data() ]
            }))
          })
      })
      // this.state.membersList.forEach(item => {
      //   const users = firestore.collection("users");
      //   users.where("id", "==", item)
      //   .get()
      //   .then(data => {
      //     console.log(data)
      //     // if (!data.empty) {
      //     //   data.forEach(doc => {
      //     //     console.log(doc)
      //     //   });
      //     // }
      //   })
      //   .catch(function(error) {
      //     console.log("Error getting documents: ", error);
      //   });
      // })
    }

    if (this.state.members !== prevState.members) {
      console.log('members changed');
      const membersReady = this.state.members.every(item => {
        return item.isReady === true;
      })
      this.setState({
        membersReady
      })
    }
  }

  handleUserReady = e => {
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

  handleUserNotReady = e => {
    firestore.collection("users").doc(this.props.userId).update({
      isReady: false
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
        <p>Welcome {this.props.userData.name}</p>
        <button onClick={this.handleUserReady}>
          I'm Ready!
        </button>
        <button onClick={this.handleUserNotReady}>
          I'm not Ready!
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
    {({ userId, userData }) => (
      <TavernRoom
        {...props}
        userId={userId}
        userData={userData}
      />
    )}
  </ContextConsumer>
);

export default TavernRoomUpdate;
