import React, { Component } from 'react';
import { ContextUserConsumer } from "../../context/ContextFirebaseUserProvider";
import { ContextTavernConsumer } from "../../context/ContextFirebaseTavernProvider";
import { Link } from "react-router-dom";

class User extends Component {
  constructor() {
    super();
    this.state = {
      tavernId: '',
      tavernName: '',
      tavernAdmin: '',
    }
  }

  componentDidMount(){
    this.props.getTavernData(this.props.tavernId).then(result => this.setState({
      tavernName: result.name,
      tavernAdmin: result.admin,
    }))
    this.setState({
      tavernId: this.props.id,
    })
  }

  render(){
    return(
      <Link className="item-list__link" to={`/tavern/${this.props.tavernId}`}>
        <li className="item-list__item">{this.state.tavernName} {this.state.tavernAdmin === this.props.userId ? <i class="item-list__icon material-icons">fingerprint</i> : null}</li>
      </Link>
    );
  }
}

const UserUpdate = props => (
  <ContextUserConsumer>
    {({ userId }) => (
      <ContextTavernConsumer>
        {({ getTavernData }) => (
          <User
            {...props}
            userId={userId}
            getTavernData={getTavernData}
          />
        )}
      </ContextTavernConsumer>
    )}
  </ContextUserConsumer>
);

export default UserUpdate;
