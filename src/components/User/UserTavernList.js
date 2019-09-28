import React, { Component } from 'react';
import { ContextUserConsumer } from "../../context/ContextFirebaseUserProvider";
import UserTavernListItem from "./UserTavernListItem";

class User extends Component {

  render(){
    return (
      <React.Fragment>
        <h1>{this.props.userData.name}'s Rooms</h1>
        <ul className="test">
          {this.props.userData.taverns && this.props.userData.taverns.length && this.props.userData.taverns.map(item => {
            return <UserTavernListItem key={item} tavernId={item} />
          })}
        </ul>
      </React.Fragment>
    );
  }
}

const UserUpdate = props => (
  <ContextUserConsumer>
    {({ userId, userData, logoutUser }) => (
      <User
        // remember to spread the existing props otherwise you lose any new ones e.g. 'something' that don't come from the provider
        {...props}
        userId={userId}
        userData={userData}
        logoutUser={logoutUser}
      />
    )}
  </ContextUserConsumer>
);

export default UserUpdate;
