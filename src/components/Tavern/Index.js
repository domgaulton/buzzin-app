import React, { Component } from 'react';
import { ContextUserConsumer } from "../../context/ContextFirebaseUserProvider";
import { ContextTavernConsumer } from "../../context/ContextFirebaseTavernProvider";
import { Link } from "react-router-dom";
import '../../styles/App.css';

class Tavern extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tavernName: '',
      adminUser: false,
      membersReady: false,
      timePercentLeft: 100,
    };
  }

  componentDidMount(){
    this.props.setTavernData(this.props.match.params.tavernId);
    this.props.setMemberData(this.props.match.params.tavernId);
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

    if (this.props.tavernData.countdownActive !== prevProps.tavernData.countdownActive) {

      if (this.props.tavernData.countdownActive === true) {
        let countdownTimer = this.props.tavernData.countdown;
        const timerId = setInterval(() => {
          if (countdownTimer === 0 ) {
            clearTimeout(timerId);
            this.setState({
              timePercentLeft: 100,
            })
            this.props.setCountdownActive(false);
          } else if ( this.props.tavernData.countdownActive === true && countdownTimer !== 0 ) {
            countdownTimer --;
            const percentWidth = (countdownTimer / this.props.tavernData.countdown) * 100;
            this.setState({
              timePercentLeft: percentWidth,
            })
          } else {
            this.setState({
              timePercentLeft: 100,
            })
          }
        }, 1000)
      } else {
        this.setState({
          timePercentLeft: 100,
        })
      }
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

  checkAdmin = () => {
    if (this.props.userId === this.props.tavernData.admin) {
      return true;
    }
  }

  toggleCountdown = () => {
    if (this.props.tavernData.countdownActive === false){
      this.props.setCountdownActive(true);
    } else {
      this.props.setCountdownActive(false);
    }
  }

  render(){
    return this.props.userLoggedIn ? (
      <div>
        <button onClick={this.props.logoutUser}>Logout</button>
        <h1>{this.props.tavernData.name}</h1>
        <p>Welcome {this.props.userData.name} {this.checkAdmin() ? '(admin)' : '(guest)'}</p>
        {this.checkAdmin() && (
          <button disabled={!this.state.membersReady} onClick={this.toggleCountdown}>{this.props.tavernData.countdownActive ? 'Restart timer!' : 'Start timer!'}</button>
        )}
        <button onClick={() => this.handleUserReady()}>
          I'm Ready!
        </button>
        <button onClick={() => this.handleUserNotReady()}>
          I'm not Ready!
        </button>
        <p>Time remaining: {this.props.tavernData.countdown} seconds</p>
        <p>Members are {this.state.membersReady ? '' : 'not'} ready!</p>
        {this.createMembersList()}
        <div className="countdown-wrapper">
          <div className="countdown-wrapper__countdown" style={{width: `${this.state.timePercentLeft}%`}}>
            {this.props.tavernData.countdownReady ? 'ready' : 'not ready'}
          </div>
        </div>
      </div>
    ) : (
      <div>
        <h1>You must be logged in</h1>
        <Link to='/'>Login</Link>
      </div>
    );
  };
}

const TavernUpdate = props => (
  <ContextUserConsumer>
    {({ userLoggedIn, userId, userData, logoutUser }) => (
      <ContextTavernConsumer>
        {({ tavernData, setTavernData, memberData, setMemberData, setUserReady, setCountdownActive }) => (
          <Tavern
            {...props}
            userLoggedIn={userLoggedIn}
            userId={userId}
            userData={userData}
            logoutUser={logoutUser}
            tavernData={tavernData}
            setTavernData={setTavernData}
            memberData={memberData}
            setMemberData={setMemberData}
            setUserReady={setUserReady}
            setCountdownActive={setCountdownActive}
          />
        )}
      </ContextTavernConsumer>
    )}
  </ContextUserConsumer>
);

export default TavernUpdate;
