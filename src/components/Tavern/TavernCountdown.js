import React, { Component } from 'react';
import { ContextTavernConsumer } from "../../context/ContextFirebaseTavernProvider";

class TavernCountdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      percentLeft: 100,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.countdownActive !== prevProps.countdownActive) {
      this.props.setCountdownActive(this.props.countdownActive);
      if (this.props.countdownActive === true) {
        this.handleStartTimer();
      } else {
        this.handleStopTimer();
      }
    }
  }

  componentWillUnmount() {
    this.handleStopTimer();
  }

  handleStartTimer = () => {
    let tempCountdownTime = this.props.countdownTime;
    this.timerId = setInterval(() => {
      if (tempCountdownTime === 0 ) {
        clearInterval(this.timerId);
        this.setState({
          percentLeft: 100,
        })
        this.props.setCountdownActive(false);
      } else if ( this.props.countdownActive === true && tempCountdownTime !== 0 ) {
        tempCountdownTime --;
        const percent = (tempCountdownTime / this.props.countdownTime) * 100;
        this.setState({
          percentLeft: percent,
        })
      } else {
        this.setState({
          percentLeft: 100,
        })
      }
    }, 1000)
  }

  handleStopTimer = () => {
    if (this.timerId){
      clearInterval(this.timerId);
      this.props.setCountdownActive(false);
      this.setState({
        percentLeft: 100,
      })
    }
  }

  render(){
    return (
      <div className="container">
        <div className="countdown-wrapper">
          {`Time left: ${Math.round((this.state.percentLeft / 100) * this.props.countdownTime)} seconds`}
          <div className="countdown-wrapper__countdown" style={{height: `${this.state.percentLeft}%`}} />
        </div>
      </div>
    );
  };
}

const TavernCountdownUpdate = props => (
  <ContextTavernConsumer>
    {({ setCountdownActive }) => (
      <TavernCountdown
        {...props}
        setCountdownActive={setCountdownActive}
      />
    )}
  </ContextTavernConsumer>
);

export default TavernCountdownUpdate;

