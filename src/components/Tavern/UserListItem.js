import React, { Component } from 'react';
import { ContextUserConsumer } from "../../context/ContextFirebaseUserProvider";

class UserListItem extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
    }
  }

  componentDidMount(){
    this.props.getUserData(this.props.userData.id).then(result => this.setState({
      name: result.name,
    }))
  }

  render(){
    // console.log(this.props.buzzedIn);
    return(
      <li className={`item-list__item ${this.props.buzzedIn === this.props.userData.id ? 'item-list__item--highlight' : ''}`} key={this.props.userData.id}>{this.state.name} {this.props.userData.isReady ? <i className="item-list__icon material-icons text-green">thumb_up_alt</i> : <i className="item-list__icon material-icons text-red">thumb_down_alt</i>}</li>
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
