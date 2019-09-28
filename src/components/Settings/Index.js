import React, { Component } from 'react';
import { ContextUserConsumer } from "../../context/ContextFirebaseUserProvider";

class Settings extends Component {

  render(){
    return (
      <h1>{this.props.userId}</h1>
    );
  }
}

const SettingsUpdate = props => (
  <ContextUserConsumer>
    {({ userId }) => (
      <Settings
        {...props}
        userId={userId}
      />
    )}
  </ContextUserConsumer>
);

export default SettingsUpdate;
