import React, { Component } from 'react';
// import { ContextConsumer } from "../context/ContextFirebaseProvider";
import { firestore } from "../base";

class TavernUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      memberObj: {}
    };
  }

  componentDidMount() {
    console.log(this.props.memberId)
    firestore.collection("users").doc(this.props.memberId)
      .onSnapshot({
        includeMetadataChanges: true
      },doc => {
        console.log(doc.data());
        this.setState = ({
          memberObj: doc.data(),
        });
      })
    }


  // componentDidUpdate(prevProps) {
  //   if (this.props.memberId !== prevProps.memberId ){
  //   console.log(this.props.memberId)
  //   firestore.collection("users").doc(this.props.memberId)
  //     .onSnapshot({
  //       includeMetadataChanges: true
  //     },doc => {
  //       console.log(doc.data());
  //       this.setState = ({
  //         memberObj: doc.data(),
  //       });
  //     })
  //   }
  // }

  render(){
    console.log(this.props.memberId)
    return (
      firestore.collection("users").doc(this.props.memberId)
      .onSnapshot({
        includeMetadataChanges: true
      },doc => {

          <li key={doc.id}>{doc.data().name}, is {doc.data().isReady ? 'ready' : 'not ready'}</li>

        // console.log(doc.data());
        // this.setState = ({
        //   memberObj: doc.data(),
        // });
      })

    );
  }

}

export default TavernUser;
