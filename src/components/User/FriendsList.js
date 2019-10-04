import React, { Component } from 'react';
import { ContextUserConsumer } from "../../context/ContextFirebaseUserProvider";
import FriendsListItem from './FriendsListItem';

class FriendsList extends Component {

  confirmFriend = userId => {
    this.props.confirmFriendRequest(userId);
  }

  render(){
    return (
      <React.Fragment>
        <h3>Total Friends: ({this.props.userData.friends && this.props.userData.friends.length})</h3>

        {this.props.userData.friends ? (
          <ul className="item-list">
            {this.props.userData.friends.map(item => {
              return <FriendsListItem data={item} confirm={true} />
            })}
          </ul>
        ) : null }

        {this.props.userData.friendsPending ? (
          <ul className="item-list">
            {this.props.userData.friendsPending.map(item => {
              return <FriendsListItem data={item} confirm={false} />
            })}
          </ul>
        ) : null }
      </React.Fragment>
    );
  }
}

const FriendsListUpdate = props => (
  <ContextUserConsumer>
    {({  userData }) => (
      <FriendsList
        // remember to spread the existing props otherwise you lose any new ones e.g. 'something' that don't come from the provider
        {...props}
        userData={userData}
      />
    )}
  </ContextUserConsumer>
);

export default FriendsListUpdate;
