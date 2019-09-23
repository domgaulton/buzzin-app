import React, { Component } from 'react';
import { ContextUserConsumer } from "../context/ContextFirebaseUserProvider";
import { ContextTavernConsumer } from "../context/ContextFirebaseTavernProvider";

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

  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.memberData !== prevProps.memberData) {
      const membersReady = this.props.memberData.every(item => {
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
        {this.props.memberData.map(item => {
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
        {({ tavernData, setTavernData, memberData, setMemberData, setUserReady }) => (
          <TavernRoom
            {...props}
            userId={userId}
            userData={userData}
            tavernData={tavernData}
            setTavernData={setTavernData}
            memberData={memberData}
            setMemberData={setMemberData}
            setUserReady={setUserReady}
          />
        )}
      </ContextTavernConsumer>
    )}
  </ContextUserConsumer>
);

export default TavernRoomUpdate;