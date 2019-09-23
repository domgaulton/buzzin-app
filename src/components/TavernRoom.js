import React, { Component } from 'react';
import { ContextUserConsumer } from "../context/ContextFirebaseUserProvider";
import { ContextTavernConsumer } from "../context/ContextFirebaseTavernProvider";
// import { firestore } from "../base";
// import TavernUser from './TavernUser';

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

    this.props.setTavernData(this.props.tavernId);
    // this.props.setTavernMemberData();
    // firestore.collection("taverns").doc(this.props.tavernId)
    //   .onSnapshot({
    //     // Listen for document metadata changes
    //     includeMetadataChanges: true
    //   },(doc) => {
    //     const membersList = doc.data().members;
    //     this.setState({
    //       membersList
    //     })
    // });
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
    // if (this.props.tavernData.members !== prevState.tavernData.members ){
    //   // console.log('members list changed');
    //   // let tempMembersList = []
    //   this.props.tavernData.members.map(item => {
    //     // console.log(item);
    //     firestore.collection("users").doc(item)
    //       .onSnapshot({
    //         includeMetadataChanges: true
    //       },doc => {
    //         // const memberObj = doc.data();
    //         // tempMembersList.push(memberObj)
    //         // console.log(doc.data())
    //         this.setState(prevState => ({
    //           members: [...prevState.members, doc.data() ]
    //         }))
    //       })
    //   })
    //   // this.state.membersList.forEach(item => {
    //   //   const users = firestore.collection("users");
    //   //   users.where("id", "==", item)
    //   //   .get()
    //   //   .then(data => {
    //   //     console.log(data)
    //   //     // if (!data.empty) {
    //   //     //   data.forEach(doc => {
    //   //     //     console.log(doc)
    //   //     //   });
    //   //     // }
    //   //   })
    //   //   .catch(function(error) {
    //   //     console.log("Error getting documents: ", error);
    //   //   });
    //   // })
    // }

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
    this.props.setUserReady(this.props.tavernId, this.props.userId, true)
  }

  handleUserNotReady = e => {
    this.props.setUserReady(this.props.tavernId, this.props.userId, false)
  }


  createMembersList = () => {
    console.log(this.props.tavernData);
    if (this.props.tavernData && this.props.tavernData.members){
      console.log('members')
      return (
        <ul className="test">
          {this.props.tavernData.members.map(item => {
            return (
              <li key={item.id}>{item.name}, is {item.isReady ? 'ready' : 'not ready'}</li>
            )
          })}
        </ul>
      );
    }
  }

  render(){
    return (
      <div>
        <h1>{this.props.tavernData.name}</h1>
        <p>Welcome {this.props.userData.name}</p>
        <button onClick={() => this.handleUserReady()}>
          I'm Ready!
        </button>
        <button onClick={() => this.handleUserNotReady()}>
          I'm not Ready!
        </button>
        <p>Time limit: {this.props.countdown}</p>
        <p>Members are {this.state.membersReady ? '' : 'not'} ready!</p>
        {this.createMembersList()}
      </div>
    );
  };
}

const TavernRoomUpdate = props => (
  <ContextUserConsumer>
    {({ userId, userData }) => (
      <ContextTavernConsumer>
        {({ tavernData, setTavernData, setUserReady }) => (
          <TavernRoom
            {...props}
            userId={userId}
            userData={userData}
            setUserReady={setUserReady}
            tavernData={tavernData}
            // setTavernMemberData={setTavernMemberData}
            setTavernData={setTavernData}
          />
        )}
      </ContextTavernConsumer>
    )}
  </ContextUserConsumer>
);

export default TavernRoomUpdate;