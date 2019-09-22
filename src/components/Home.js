import React, { Component } from 'react';
import { ContextConsumer } from "../context/ContextFirebaseProvider";
import { BrowserRouter as Link } from "react-router-dom";
import { firestore } from "../base";
import '../styles/App.css';


class Home extends Component {
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
    console.log(this.props.userData)

    if (this.props.userData && this.props.userData.taverns){

      // let tavernsTemp = [];
      const taverns = this.props.userData.taverns;
      console.log(taverns);
      taverns.forEach(item => {
        console.log(item)
      firestore.collection("taverns").doc(item)
        .onSnapshot({
          includeMetadataChanges: true
        },(doc) => {
          const tavernName = doc.data().name;
          // tavernsTemp.push(tavernName)
          console.log(doc.data())
          this.setState(prevState => ({
            taverns: [...prevState.taverns, tavernName]
          }))
        });
      })
      // console.log(tavernsTemp);
      // this.setState({
      //   taverns: tavernsTemp,
      // })
    }


  }

  handleInputChange = e => {
    this.setState({
      roomName: e.currentTarget.value
    })
  }

  handleRoomChecker = e => {
    e.preventDefault();
    const taverns = firestore.collection("taverns");
    taverns.where("name", "==", this.props.roomName)
    .get()
    .then(function(data) {
      console.log(data)
      if (!data.empty) {
        data.forEach(function(doc) {
          console.log(doc.id);
          this.props.history.push(`/tavern/${doc.id}`)
        });
      }
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
  }

  handleCreateRoom = e => {
    console.log('test')
    e.preventDefault();

    firestore.collection("taverns").add({
      name: this.state.createRoomName,
      pin: this.state.createPin,
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
  }

  handle_createRoomNameInputChange = e => {
    this.setState({
      createRoomName: e.currentTarget.value
    })
  }

  handle_createPinInputChange = e => {
    this.setState({
      createPin: e.currentTarget.value
    })
  }

  createRoomList = array => {
    console.log(array)
    return (
      <ul className="test">
        {array.map(function(name, index){
          return(
            <Link key={index}  to="/about">
              <li >{name}</li>
            </Link>
          );
        })}
      </ul>
    );
  }
  render(){
    return (
      <div className="App">
        <h1>Create Tavern</h1>
         <form onSubmit={e => this.handleCreateRoom(e)}>
          <input
            type='text'
            placeholder='Enter Tavern Name'
            value={this.state.createRoomName}
            onChange={e => this.handle_createRoomNameInputChange(e)}
          />
          <input
            type='text'
            placeholder='Enter Pin'
            value={this.state.createPin}
            onChange={e => this.handle_createPinInputChange(e)}
          />
          <input type="submit" />
        </form>

        <h1>{this.props.userData.name}'s Rooms</h1>

        <h1>Dom is {this.props.userData.isReady ? '' : 'not'} ready to play!</h1>
        {this.createRoomList(this.state.taverns)}
      </div>
    );
  }
}

const HomeUpdate = props => (
  <ContextConsumer>
    {({ userData, membersReady }) => (
      <Home
        // remember to spread the existing props otherwise you lose any new ones e.g. 'something' that don't come from the provider
        {...props}
        userData={userData}
        membersReady={membersReady}
      />
    )}
  </ContextConsumer>
);

export default HomeUpdate;
