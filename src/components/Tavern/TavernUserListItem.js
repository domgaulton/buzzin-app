import React, { Component } from 'react';
import { ContextUserConsumer } from "../../context/ContextFirebaseUserProvider";

class TavernUserListItem extends Component {
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
    return(
      <li className="item-list__item" key={this.props.userData.id}>{this.state.name} {this.props.userData.isReady ? <i className="item-list__icon material-icons text-green">thumb_up_alt</i> : <i className="item-list__icon material-icons text-red">thumb_down_alt</i>}</li>
    );
  }
}

const TavernUserListItemUpdate = props => (
  <ContextUserConsumer>
    {({ getUserData }) => (
      <TavernUserListItem
        {...props}
        getUserData={getUserData}
      />
    )}
  </ContextUserConsumer>
);

export default TavernUserListItemUpdate;
