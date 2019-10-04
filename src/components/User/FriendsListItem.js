import React, { Component } from 'react';
import { ContextUserConsumer } from "../../context/ContextFirebaseUserProvider";

class FriendsListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ''
    };
  }

  componentDidMount(){
    this.props.getUserData(this.props.data).then(result => this.setState({
      name: result.name,
    }))
  }

  confirmFriend = userId => {
    this.props.confirmFriendRequest(userId);
  }

  render(){
    return (
      <li className="item-list__item">{this.state.name} {this.props.true ? <span onClick={() => this.confirmFriend(this.props.data)}>Accept</span> : null}</li>
    );
  }
}

const FriendsListItemUpdate = props => (
  <ContextUserConsumer>
    {({ getUserData }) => (
      <FriendsListItem
        {...props}
        getUserData={getUserData}
      />
    )}
  </ContextUserConsumer>
);

export default FriendsListItemUpdate;
