import React, { Component } from 'react';
import { ContextUserConsumer } from "../../context/ContextFirebaseUserProvider";
import TavernList from './TavernList';
import Login from '../Auth/Login';
import { Link } from 'react-router-dom';

class Index extends Component {

  render(){
    return this.props.userLoggedIn && this.props.userData ? (
      <div className="container">

        <h1>{this.props.userData.name}'s Taverns</h1>

        {this.props.userData.taverns && this.props.userData.taverns.length ? (
          <React.Fragment>
            <TavernList />
            <Link className="bz-navigation__item" to='/find-tavern'>Find a tavern</Link>
            <Link className="bz-navigation__item" to='/create-tavern'>Create a tavern</Link>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <p>Welcome! You aren't linked to any rooms yet, why not find a tavern or create one below?</p>
            <div className="item-block">
              <Link className="item-block__block" to='/find-tavern'>Find a tavern</Link>
              <Link className="item-block__block" to='/create-tavern'>Create a tavern</Link>
            </div>
          </React.Fragment>
        )}

      </div>
    ) : (
      <Login />
    );
  }
}

const IndexUpdate = props => (
  <ContextUserConsumer>
    {({ userLoggedIn, userData }) => (
      <Index
        // remember to spread the existing props otherwise you lose any new ones e.g. 'something' that don't come from the provider
        {...props}
        userLoggedIn={userLoggedIn}
        userData={userData}
      />
    )}
  </ContextUserConsumer>
);

export default IndexUpdate;
