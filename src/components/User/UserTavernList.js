import React, { Component } from 'react';
import { ContextUserConsumer } from "../../context/ContextFirebaseUserProvider";
import { Link } from "react-router-dom";

class User extends Component {
  render(){
    return (
      <React.Fragment>
        <h1>{this.props.userData.name}'s Rooms</h1>
        <ul className="test">
          {this.props.userData.taverns && this.props.userData.taverns.length && this.props.userData.taverns.map(item => {
            return(
              <Link key={item.id}  to={`/tavern/${item.id}`}>
                <li>{item.name} {item.admin === this.props.userId ? '(admin)' : null}</li>
              </Link>
            );
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
