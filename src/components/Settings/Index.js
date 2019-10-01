import React, { Component } from 'react';
import { ContextUserConsumer } from "../../context/ContextFirebaseUserProvider";
import { Link } from 'react-router-dom';
import Login from '../Auth/Login';

class Settings extends Component {

  render(){
    return this.props.userLoggedIn ? (
      <React.Fragment>
        <nav>
          <ul>
            <li>
              <Link to={`/logout`}>
                <i className="material-icons">exit_to_app</i>
                <span>Logout</span>
              </Link>
            </li>
            <li onClick={() => this.props.deleteUser(this.props.userId)}>
              <i className="material-icons">exit_to_app</i>
              <span>Delete User</span>
            </li>
          </ul>
        </nav>
      </React.Fragment>
    ) : (
      <Login />
    );;
  }
}

const SettingsUpdate = props => (
  <ContextUserConsumer>
    {({ userId, logoutUser, userLoggedIn, deleteUser  }) => (
      <Settings
        {...props}
        userId={userId}
        logoutUser={logoutUser}
        userLoggedIn={userLoggedIn}
        deleteUser={deleteUser}
      />
    )}
  </ContextUserConsumer>
);

export default SettingsUpdate;
