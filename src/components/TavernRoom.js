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
      membersReady: false,
    };
  }

  componentDidMount(){
    this.props.setTavernData(this.props.tavernId);
    this.props.setMemberData(this.props.tavernId);

    // firestore.collection("taverns").doc(this.props.tavernId).collection("members")
    // .get()
    // .then(querySnapshot => {
    //   const data = querySnapshot.docs.map(doc => doc.data());
    //   this.setState({ members: data });
    // });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.tavernMemberData !== prevProps.tavernMemberData) {
      const membersReady = this.props.tavernMemberData.every(item => {
        return item.isReady === true;
      })
      this.setState({
        membersReady
      })
    }
  }

  handleUserReady = e => {
    this.props.setUserReady(this.props.userId, true)
  }

  handleUserNotReady = e => {
    this.props.setUserReady(this.props.userId, false)
  }


  createMembersList = () => {
    return (
      <ul className="test">
        {this.props.tavernMemberData.map(item => {
          return (
            <li key={item.name}>{item.name}, is {item.isReady ? 'ready' : 'not ready'}</li>
          )
        })}
      </ul>
    );
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
        {({ tavernData, setTavernData, setMemberData, setUserReady, tavernMemberData }) => (
          <TavernRoom
            {...props}
            userId={userId}
            userData={userData}
            setUserReady={setUserReady}
            tavernData={tavernData}
            setMemberData={setMemberData}
            setTavernData={setTavernData}
            tavernMemberData={tavernMemberData}
          />
        )}
      </ContextTavernConsumer>
    )}
  </ContextUserConsumer>
);

export default TavernRoomUpdate;