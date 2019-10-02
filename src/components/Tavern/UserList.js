import React, { Component } from 'react';
import { ContextTavernConsumer } from "../../context/ContextFirebaseTavernProvider";
import UserListItem from "./UserListItem";

class UserList extends Component {

  render(){
    return (
      <React.Fragment>
        <ul className="item-list">
          {this.props.tavernData && this.props.tavernData.members && this.props.tavernData.members.length && this.props.tavernData.members.map(item => {
            return <UserListItem key={item.id} userData={item} />
          })}
        </ul>
      </React.Fragment>
    );
  }
}

const UserListUpdate = props => (
  <ContextTavernConsumer>
    {({ tavernData }) => (
      <UserList
        // remember to spread the existing props otherwise you lose any new ones e.g. 'something' that don't come from the provider
        {...props}
        tavernData={tavernData}
      />
    )}
  </ContextTavernConsumer>
);

export default UserListUpdate;
