import React, { Component } from 'react';
import { ContextUserConsumer } from "../../context/ContextFirebaseUserProvider";
import { ContextTavernConsumer } from "../../context/ContextFirebaseTavernProvider";
import { Link } from "react-router-dom";
// import { firestore } from "../../base";

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
      <Link to={`/tavern/${this.props.tavernId}`}>
        <li>{this.state.tavernName} {this.state.tavernAdmin === this.props.userId ? '(admin)' : null}</li>
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
