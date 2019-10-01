import React, { Component } from 'react';
import { ContextUserConsumer } from "../../context/ContextFirebaseUserProvider";
import TavernList from './TavernList';
import CreateNewTavern from './CreateNewTavern';
import FindTavern from './FindTavern';
import Login from '../Auth/Login';

class TavernHome extends Component {

  render(){
    return this.props.userLoggedIn ? (
      <div className="container">

        <h1>{this.props.userData.name}'s Taverns</h1>

        <TavernList />

        <FindTavern />

        <CreateNewTavern />

      </div>
    ) : (
      <Login />
    );
  }
}

const TavernHomeUpdate = props => (
  <ContextUserConsumer>
    {({ userLoggedIn, userData }) => (
      <TavernHome
        // remember to spread the existing props otherwise you lose any new ones e.g. 'something' that don't come from the provider
        {...props}
        userLoggedIn={userLoggedIn}
        userData={userData}
      />
    )}
  </ContextUserConsumer>
);

export default TavernHomeUpdate;
