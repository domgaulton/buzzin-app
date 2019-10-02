import React, { Component } from 'react';
import { ContextUserConsumer } from "../../context/ContextFirebaseUserProvider";
import { ContextTavernConsumer } from "../../context/ContextFirebaseTavernProvider";
import TavernCountdown from './TavernCountdown';
import UserList from './UserList';
import Toggle from './Toggle';
import Login from '../Auth/Login';

class Tavern extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tavernName: '',
      adminUser: false,
      membersReady: false,
      countdownActive: false,
      timePercentLeft: 100,
    };
  }

  componentDidMount(){
    this.props.setTavernData(this.props.match.params.tavernId);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.tavernData.members !== prevProps.tavernData.members) {
      const membersReady = this.props.tavernData.members.every(item => {
        return item.isReady === true;
      })
      this.setState({
        membersReady
      })
    }

    if (this.props.tavernData.countdownActive !== prevProps.tavernData.countdownActive) {
      this.setState({
        countdownActive: this.props.tavernData.countdownActive,
      })
    }
  }

  componentWillUnmount = () => {
    this.props.resetUsersNotReady(this.props.match.params.tavernId);
  }

  handleToggleUserReady = e => {
    this.props.setUserReady(this.props.userId, e.target.checked);
  }

  checkAdmin = () => {
    if (this.props.userId === this.props.tavernData.admin) {
      return true;
    }
  }

  toggleCountdown = () => {
    this.setState({
      countdownActive: !this.props.tavernData.countdownActive,
    })
  }

  render(){
    return this.props.userLoggedIn && this.props.tavernData ? (
      <div className="container">
        <h1>{this.props.tavernData.name}</h1>
        {this.checkAdmin() && `(Pin:${this.props.tavernData.pin})`}

        <h3>Welcome {this.props.userData.name}!</h3>

        {this.checkAdmin() ? (
          <div className={`countdown-start-stop ${!this.state.membersReady ? 'countdown-start-stop--disabled' : null}`}>
            <button
              disabled={!this.state.membersReady}
              onClick={this.toggleCountdown}
            >
                <i className="material-icons">{this.props.tavernData.countdownActive ? 'stop' : 'timer'}</i>
            </button>
          </div>
        ) : (
          <p className="room-ready">
            <span>Room Ready?</span>
            <i className="material-icons">{this.state.membersReady ? 'check' : 'close'}</i>
          </p>
        )}

        <TavernCountdown
          countdownActive={this.state.countdownActive}
          countdownTime={this.props.tavernData.countdown}
        />

        <UserList />

        <Toggle handleToggle={this.handleToggleUserReady} />
      </div>
    ) : (
      <Login />
    );
  };
}

const TavernUpdate = props => (
  <ContextUserConsumer>
    {({ userLoggedIn, userId, userData }) => (
      <ContextTavernConsumer>
        {({ tavernData, setTavernData, setUserReady, resetUsersNotReady}) => (
          <Tavern
            {...props}
            userLoggedIn={userLoggedIn}
            userId={userId}
            userData={userData}
            tavernData={tavernData}
            setTavernData={setTavernData}
            setUserReady={setUserReady}
            resetUsersNotReady={resetUsersNotReady}
          />
        )}
      </ContextTavernConsumer>
    )}
  </ContextUserConsumer>
);

export default TavernUpdate;
