import React, { Component } from 'react';
import { firestore } from "../base";

const Context = React.createContext();
export const ContextConsumer = Context.Consumer;

class FirebaseProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {},
      userLoggedIn: false,
      setUserData: (data) => this.handleSetUserData(data),
    };
  }

  componentDidMount(){

    if ( localStorage.getItem("buzzinApp") ) {
      this.handleSetUserData(localStorage.getItem("buzzinApp"))
    }
    // firestore.collection("users").doc('0JcPK6LmtSMsvxYeWpqB')
    // .onSnapshot({
    //   includeMetadataChanges: true
    // },(doc) => {
    //   const userData = doc.data();
    //   this.setState({
    //     userData
    //   })
    // });

    // firestore.collection("taverns").doc('another-tavern')
    //   .onSnapshot({
    //     // Listen for document metadata changes
    //     includeMetadataChanges: true
    //   }, (doc) => {
    //     const members = doc.data().members;
    //     const membersReady = members.every(item => {
    //       return item.ready === true;
    //     })
    //     this.setState({
    //       membersReady
    //     });
    // });
  }

  handleSetUserData = userId => {
    // console.log(userId)
    firestore.collection("users").doc(userId)
    .onSnapshot({
      includeMetadataChanges: true
    },(doc) => {
      const userId = doc.id
      const userData = doc.data();
      this.setState({
        userData,
      })
      this.setState({
        userId,
      })
      this.setState({
        userLoggedIn: true,
      })
      localStorage.setItem("buzzinApp", userId);
    });
  }


  render(){
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    );
  }

}

export default FirebaseProvider;

