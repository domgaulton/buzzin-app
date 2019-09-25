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
      taverns: []
    };
  }

  componentDidMount(){
    if (this.props.userData && this.props.userData.taverns){
      this.tavernIdsToState();
    }
  }

  componentDidUpdate(prevProps){
    if (this.props.userData.taverns !== prevProps.userData.taverns) {
      this.tavernIdsToState();
    }
  }

  tavernIdsToState(){
    this.props.userData.taverns.forEach(item => {
      console.log(item)
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
            taverns: [...prevState.taverns, tavernObj]
          }))
        });
    })
  }

  render(){
    return (
      <ul className="test">
        {this.state.taverns.map(item => {
          return(
            <Link key={item.id}  to={`/tavern/${item.id}`}>
              <li>{item.name}</li>
            </Link>
          );
        })}
      </ul>
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
