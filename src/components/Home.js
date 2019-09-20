import React, { Component } from 'react';
import { ContextConsumer } from "../context/ContextFirebaseProvider";
import '../styles/App.css';

class Home extends Component {
  render(){
    return (
      <div className="App">
        <h1>User Data</h1>
        {this.props.membersReady ? 'yes' : 'no'}
      </div>
    );
  }
}

const HomeUpdate = props => (
  <ContextConsumer>
    {({ userData, membersReady }) => (
      <Home
        // remember to spread the existing props otherwise you lose any new ones e.g. 'something' that don't come from the provider
        {...props}
        userData={userData}
        membersReady={membersReady}
      />
    )}
  </ContextConsumer>
);

export default HomeUpdate;