import React, { Component } from 'react';
import { firestore } from "../base";
import '../styles/App.css';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {},
      tavernName: '',
      members: [],
      membersReady: false,
      countdown: 0,
    };
  }

  componentDidMount(){
    firestore.collection("taverns").doc('another-tavern')
    .onSnapshot({
      // Listen for document metadata changes
      includeMetadataChanges: true
    },(doc) => {
      // const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
      // console.log(source, " data: ", doc.data());

      const tavernName = doc.data().name;
      this.setState({
        tavernName
      })

      const members = doc.data().members;
      this.setState({
        members
      })

      const membersReady = members.every(item => {
        console.log(item.ready)
        return item.ready === true;
      })
      this.setState({
        membersReady
      })

      const countdown = doc.data().options.countdown;
      this.setState({
        countdown
      })
  });
  }


    render(){
      return (
    <div className="App">
      <h1>Find Your Room</h1>
        <p>{this.state.tavernName}</p>
        <p>{this.state.membersReady ? 'ready' : 'not ready'}</p>
        <p>{this.state.countdown}</p>
    </div>
  );
    }

}

export default Home;
