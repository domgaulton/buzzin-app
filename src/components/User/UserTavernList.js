import React, { Component } from 'react';
import { ContextUserConsumer } from "../../context/ContextFirebaseUserProvider";
import { Link } from "react-router-dom";
import { firestore } from "../../base";


class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomName: '',
      createRoomName: false,
      createPin: '',
      taverns: [],
      tavernAdmins: [],
    };
  }

  componentDidMount(){
    if (this.props.userData && this.props.userData.taverns){
      this.tavernIdsToState(this.props.userData.taverns, 'taverns');
    }

    if (this.props.userData && this.props.userData.tavernAdmins){
      this.tavernIdsToState(this.props.userData.tavernAdmins, 'tavernAdmins');
    }
  }

  componentDidUpdate(prevProps){
    if (this.props.userData.taverns !== prevProps.userData.taverns && this.props.userData.taverns) {
      this.tavernIdsToState(this.props.userData.taverns, 'taverns');
    }

    if (this.props.userData.tavernAdmins !== prevProps.userData.tavernAdmins) {
      this.tavernIdsToState(this.props.userData.tavernAdmins, 'tavernAdmins');
    }
  }

  tavernIdsToState = (array, state) => {
    array.forEach(item => {
      // console.log(item)
      firestore.collection("taverns").doc(item)
        .onSnapshot({
          includeMetadataChanges: true
        },(doc) => {
          const id = doc.id;
          const name = doc.data().name;
          const tavernObj = {
            id,
            name,
          }
          this.setState(prevState => ({
            [state]: [...prevState[state], tavernObj]
          }))
        });
    })
  }

  render(){
    return (
      <React.Fragment>
        <h1>{this.props.userData.name}'s Rooms</h1>
        <p>Guests</p>
        <ul className="test">
          {this.state.taverns.map(item => {
            return(
              <Link key={item.id}  to={`/tavern/${item.id}`}>
                <li>{item.name}</li>
              </Link>
            );
          })}
        </ul>
        <p>Admin Rooms</p>
        <ul className="test">
          {this.state.tavernAdmins.map(item => {
            return(
              <Link key={item.id}  to={`/tavern/${item.id}`}>
                <li>{item.name}</li>
              </Link>
            );
          })}
        </ul>
      </React.Fragment>
    );
  }
}

const UserUpdate = props => (
  <ContextUserConsumer>
    {({ userData, logoutUser }) => (
      <User
        // remember to spread the existing props otherwise you lose any new ones e.g. 'something' that don't come from the provider
        {...props}
        userData={userData}
        logoutUser={logoutUser}
      />
    )}
  </ContextUserConsumer>
);

export default UserUpdate;
