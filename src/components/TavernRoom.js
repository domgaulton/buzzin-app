import React, { Component } from 'react';
import { ContextUserConsumer } from "../context/ContextFirebaseUserProvider";
import { ContextTavernConsumer } from "../context/ContextFirebaseTavernProvider";
import '../styles/index.css';

class TavernRoom extends Component {
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

    if (this.props.tavernData.countdownActive !== prevProps.tavernData.countdownActive) {
      if (this.props.tavernData.countdownActive === true) {
        console.log('Start countdown');
        let countdownTimer = this.props.tavernData.countdown;
        const timerId = setInterval(() => {
          if (countdownTimer === 0) {
            clearTimeout(timerId);
            this.props.setCountdownActive(false);
            this.setState({
              timePercentLeft: 100,
            })
            return
          } else {
            countdownTimer --;
            const percentWidth = (countdownTimer / this.props.tavernData.countdown) * 100;
            this.setState({
              timePercentLeft: percentWidth,
            })
            // const styleString = `${Math.floor(percentWidth)}%`
            // console.log(styleString);
            // return  {width: `${styleString}`};
          }
        }, 1000)
      } else {
        console.log('Reset countdown');
        this.setState({
          timePercentLeft: 100,
        })
        return
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
    console.log(this.props.tavernData.countdownActive);
    console.log('Update countdownReady');
    this.props.setCountdownActive(!this.props.tavernData.countdownActive);
    this.countdownTimerStyle();
  }

  countdownTimerStyle = () => {
    // if (this.props.tavernData.countdownActive === true) {
    //   console.log('Start countdown');
    //   let countdownTimer = this.props.tavernData.countdown;
    //   const timerId = setInterval(() => {
    //     if (countdownTimer === 0) {
    //       clearTimeout(timerId);
    //       this.props.setCountdownActive(false);
    //       this.setState({
    //         timePercentLeft: 100,
    //       })
    //       return
    //     } else {
    //       countdownTimer --;
    //       const percentWidth = (countdownTimer / this.props.tavernData.countdown) * 100;
    //       this.setState({
    //         timePercentLeft: percentWidth,
    //       })
    //       // const styleString = `${Math.floor(percentWidth)}%`
    //       // console.log(styleString);
    //       // return  {width: `${styleString}`};
    //     }
    //   }, 1000)
    // } else {
    //   console.log('Reset countdown');
    //   this.setState({
    //     timePercentLeft: 100,
    //   })
    //   return
    // }
  }

  render(){
    return (
      <div>
        <h1>{this.props.tavernData.name}</h1>
        <p>Welcome {this.props.userData.name} {this.checkAdmin() ? '(admin)' : '(guest)'}</p>
        {this.checkAdmin() && (
          <button disabled={!this.state.membersReady} onClick={this.toggleCountdown}>{this.props.tavernData.countdownActive ? 'Stop timer!' : 'Start timer!'}</button>
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
    );
  };
}

const TavernRoomUpdate = props => (
  <ContextUserConsumer>
    {({ userId, userData }) => (
      <ContextTavernConsumer>
        {({ tavernData, setTavernData, memberData, setMemberData, setUserReady, setCountdownActive }) => (
          <TavernRoom
            {...props}
            userId={userId}
            userData={userData}
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

export default TavernRoomUpdate;