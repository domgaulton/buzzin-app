import React, { Component } from 'react';
import { ContextUserConsumer } from "../../context/ContextFirebaseUserProvider";
import { Link } from 'react-router-dom';

class Settings extends Component {

  render(){
    return (
      <nav>
        <ul>
          <li>
            <Link to={`/logout`}>
              <i className="material-icons">exit_to_app</i>
              <span>Logout</span>
            </Link>
          </li>
        </ul>
      </nav>

    );
  }
}

const SettingsUpdate = props => (
  <ContextUserConsumer>
    {({ userId, logoutUser }) => (
      <Settings
        {...props}
        userId={userId}
        logoutUser={logoutUser}
      />
    )}
  </ContextUserConsumer>
);

export default SettingsUpdate;
