import React, { Component } from 'react';
import { ContextUserConsumer } from "../../context/ContextFirebaseUserProvider";

class UserListItem extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      adminPartipant: false,
    }
  }

  componentDidMount(){
    console.log(this.props.admin)
    this.props.getUserData(this.props.userData.id).then(result =>
      this.setState({
        name: result.name,
      })
    )
  }

  componentDidUpdate(prevProps) {
    if (this.props.adminParticipant !== prevProps.adminParticipant) {
      console.log(this.props.adminParticipant)
      this.setState({
        adminPartipant: this.props.adminParticipant
      })
    }
  }

  render(){
    return (
      <li
        className=
          {`item-list__item item-list__item${this.props.userData.isReady ? '--ready' : '--not-ready'}
          ${this.props.buzzedIn === this.props.userData.id ? 'item-list__item--buzzed-in' : ''}`}
        key={this.props.userData.id}
      >
        <span>{this.state.name}</span>
        <span>{this.props.admin ? 'true' : 'false'}</span>
        <span>({this.props.score})</span>
      </li>
    );
  }
}

const UserListItemUpdate = props => (
  <ContextUserConsumer>
    {({ getUserData }) => (
      <UserListItem
        {...props}
        getUserData={getUserData}
      />
    )}
  </ContextUserConsumer>
);

export default UserListItemUpdate;
