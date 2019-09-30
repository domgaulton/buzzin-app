import React, { Component } from 'react';
import { ContextUserConsumer } from "../../context/ContextFirebaseUserProvider";
import { ContextTavernConsumer } from "../../context/ContextFirebaseTavernProvider";
import TavernUserListItem from './TavernUserListItem';
import Login from '../Auth/Login';

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

      if (this.props.tavernData.countdownActive === true) {
        let countdownTimer = this.props.tavernData.countdown;
        const timerId = setInterval(() => {
          if (countdownTimer === 0 ) {
            clearInterval(timerId);
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

  handleToggleUserReady = e => {
    console.log(e.target.checked);
    this.props.setUserReady(this.props.userId, e.target.checked)
  }


  createMembersList = () => {
    return (
      <ul className="item-list">
        {this.props.tavernData && this.props.tavernData.members && this.props.tavernData.members.length && this.props.tavernData.members.map(item => {
          return <TavernUserListItem key={item.id} userData={item}/>
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
      clearInterval(this.timer);
      this.props.setCountdownActive(false);
    }
  }

  render(){
    return this.props.userLoggedIn ? (
      <div className="container">
        <h1>{this.props.tavernData.name}</h1>
        <p>Welcome {this.props.userData.name} {this.checkAdmin() ? '(admin)' : '(guest)'}</p>
        {this.checkAdmin() && (
          <button disabled={!this.state.membersReady} onClick={this.toggleCountdown}>{this.props.tavernData.countdownActive ? <i className="material-icons text-green">stop</i> : <i className="material-icons text-green">av_timer</i>}</button>
        )}
        <p>Time remaining: {this.props.tavernData.countdown} seconds</p>

        {this.createMembersList()}
        <div className="countdown-wrapper">
          <div className="countdown-wrapper__countdown" style={{height: `${this.state.timePercentLeft}%`}} />
        </div>
        <p className="members-ready">Everyone Ready? {this.state.membersReady ? <i className="material-icons text-green">thumb_up_alt</i> : <i className="material-icons text-red">thumb_down_alt</i>}</p>

        <div className="toggle-user-ready">
          Ready?
          <label for="userReady" />
          <input className="toggle-user-ready" type="checkbox" name="userReady" id="userReady" onClick={(e) => this.handleToggleUserReady(e)}/>
          <span className="toggle-user-ready__display"/>
        </div>
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
        {({ tavernData, setTavernData, setUserReady, setCountdownActive }) => (
          <Tavern
            {...props}
            userLoggedIn={userLoggedIn}
            userId={userId}
            userData={userData}
            tavernData={tavernData}
            setTavernData={setTavernData}
            setUserReady={setUserReady}
            setCountdownActive={setCountdownActive}
          />
        )}
      </ContextTavernConsumer>
    )}
  </ContextUserConsumer>
);

export default TavernUpdate;
