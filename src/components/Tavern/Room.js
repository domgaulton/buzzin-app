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
      if (this.props.tavernData.buzzedIn !== ''){
        this.setState({
          buzzedIn: this.props.tavernData.buzzedIn
        })
      } else {
        this.setState({
          buzzedIn: '',
        })
      }
    }
  }

  componentWillUnmount = () => {
    this.handleScoresAndTavernStates(this.props.tavernData.members);
  }

  handleScoresAndTavernStates = members => {
    // Set and reset score
    if (members) {
      members.forEach(item => {
        // update individual scores on user collection
        this.props.updateUserData(item.id, 'score', item.score)
        // reset all users to 0
        this.props.resetTavernScores(item.id)
      }, () => {
        // then reset the tavern data
        this.props.resetUsersToNotReady(this.props.match.params.tavernId);
        this.props.setCountdownActive(false);
        this.props.userAnswered(false);
      })
    }
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
    this.props.userBuzzedIn(this.props.userId);
  }

  handleAdjudication = (e) => {
    if (e.target.value) {
      this.props.userAnswered(e.target.value, this.state.buzzedIn);
    }
  }

  render(){
    return this.props.userLoggedIn && this.props.tavernData ? (
      <div className="container">
        <p>{this.props.tavernData.name} {this.checkAdmin() && `(Pin:${this.props.tavernData.pin})`}</p>


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
          null // Later we might put the buzzer here as admin can't play
        )}

        <TavernCountdown
          countdownActive={this.state.countdownActive}
          countdownTime={this.props.tavernData.countdown}
          paused={this.state.buzzedIn !== ''}
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

        {!this.state.membersReady ? (
          <Toggle handleToggle={this.handleToggleUserReady} />
        ) : null }

      </div>
    ) : (
      <Login />
    );
  };
}

const TavernUpdate = props => (
  <ContextUserConsumer>
    {({ userLoggedIn, userId, userData, getUserData, updateUserData }) => (
      <ContextTavernConsumer>
        {({ tavernData,setTavernData, setUserReady, resetUsersToNotReady, setCountdownActive, userBuzzedIn, userAnswered, resetTavernScores }) => (
          <Tavern
            {...props}
            userLoggedIn={userLoggedIn}
            userId={userId}
            userData={userData}
            getUserData={getUserData}
            updateUserData={updateUserData}
            tavernData={tavernData}
            setTavernData={setTavernData}
            setUserReady={setUserReady}
            resetUsersToNotReady={resetUsersToNotReady}
            setCountdownActive={setCountdownActive}
            userBuzzedIn={userBuzzedIn}
            userAnswered={userAnswered}
            resetTavernScores={resetTavernScores}
          />
        )}
      </ContextTavernConsumer>
    )}
  </ContextUserConsumer>
);

export default TavernUpdate;
