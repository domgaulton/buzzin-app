import React, { Component } from 'react';
import { ContextUserConsumer } from "../../context/ContextFirebaseUserProvider";
import { ContextTavernConsumer } from "../../context/ContextFirebaseTavernProvider";
import TavernCountdown from './TavernCountdown';
import UserList from './UserList';
import Buzzer from './Buzzer';
import Toggle from './Toggle';
import Login from '../Auth/Login';

class Tavern extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tavernName: '',
      adminUser: false,
      membersReady: false,
      buzzedIn: '',
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

    if (this.props.tavernData.buzzedIn !== prevProps.tavernData.buzzedIn) {
      console.log('buzzedIn', this.props.tavernData.buzzedIn)
      if (this.props.tavernData.buzzedIn !== ''){
        // const name = this.props.getUserData(this.props.tavernData.buzzedIn).then(result => result.name)
        // console.log(name)
        this.props.getUserData(this.props.tavernData.buzzedIn).then(result => this.setState({
          buzzedIn: result.name,
        }))
      } else {
        this.setState({
          buzzedIn: '',
        })
      }
    }
  }

  componentWillUnmount = () => {
    this.props.resetUsersNotReady(this.props.match.params.tavernId);
    this.props.setCountdownActive(false);
    // this.props.userAnswered(false);
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

  handleUserBuzzer = () => {
    console.log(this.props.userId)
    this.props.userBuzzedIn(this.props.userId);
  }

  handleAdjudication = (e) => {
    console.log(e.target.value)
    if (e.target.value) {
      this.props.userAnswered(e.target.value);
    }
  }

  render(){
    return this.props.userLoggedIn && this.props.tavernData ? (
      <div className="container">
        <h1>{this.props.tavernData.name}</h1>
        {this.checkAdmin() && `(Pin:${this.props.tavernData.pin})`}

        <span className={`buzzed-in ${this.state.buzzedIn ? 'buzzed-in--display' : ''}`}>{this.state.buzzedIn} buzzed!</span>

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

        {this.checkAdmin() & this.state.buzzedIn !== '' ? (
          <form
            onClick={(e) => this.handleAdjudication(e)}
            className='admin-adjudication'
          >
            <div className="admin-adjudication__button">
              <label htmlFor="answerCorrect">
                <i className="material-icons text-red">close</i>
              </label>
              <input id="answerCorrect" type="radio" name="admin-adjudication" value={false} />
            </div>
            <div className="admin-adjudication__button">
              <label htmlFor="answerIncorrect">
                <i className="material-icons  text-green">check</i>
              </label>
              <input id="answerIncorrect" type="radio" name="admin-adjudication" value={true} />
            </div>
          </form>
        ) : null}

        <Buzzer handleBuzzer={this.handleUserBuzzer} buzzerDisabled={!this.state.countdownActive}/>

        <Toggle handleToggle={this.handleToggleUserReady} />
      </div>
    ) : (
      <Login />
    );
  };
}

const TavernUpdate = props => (
  <ContextUserConsumer>
    {({ userLoggedIn, userId, userData, getUserData }) => (
      <ContextTavernConsumer>
        {({ tavernData,setTavernData, setUserReady, resetUsersNotReady, setCountdownActive, userBuzzedIn, userAnswered }) => (
          <Tavern
            {...props}
            userLoggedIn={userLoggedIn}
            userId={userId}
            userData={userData}
            getUserData={getUserData}
            tavernData={tavernData}
            setTavernData={setTavernData}
            setUserReady={setUserReady}
            resetUsersNotReady={resetUsersNotReady}
            setCountdownActive={setCountdownActive}
            userBuzzedIn={userBuzzedIn}
            userAnswered={userAnswered}
          />
        )}
      </ContextTavernConsumer>
    )}
  </ContextUserConsumer>
);

export default TavernUpdate;
