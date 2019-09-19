import React, { useState } from 'react';
import { firestore } from "../base";

function TavernLogin(props) {

  const [pinNo, set_pinNo] = useState(undefined);
  const [pinCorrect, set_pinCorrect] = useState(false);

  // const pin = () => {
  //   firestore.collection("taverns").doc(props.match.params.tavernId).get().then((querySnapshot) => {
  //     return querySnapshot.data().options.pin;
  //   });
  // }
  const pin = firestore.collection("taverns").doc(props.tavernId).get().then(function(doc) {
      if (doc.exists) {
          const pinNo = doc.data().options.pin
          console.log("Document data:", pinNo);
          return pinNo
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    })

  console.log(pin)
  // firestore.collection("taverns").doc(props.tavernId).get().then((querySnapshot) => {
  //   console.log(querySnapshot.data().options.pin)
  //   set_pinNo(querySnapshot.data().options.pin);
  // });

  const checkPin = (e) => {
    //console.log(e.currentTarget.value)
    if (e.currentTarget.value == 1234){
      console.log('hello!')
    }
    // props.pinCorrect(true);
  }

  return (
    <React.Fragment>
      <h1>Enter Pin</h1>
      <input type='number' placeholder='enter pin' onChange={e => checkPin(e)}/>
    </React.Fragment>
  );

}

export default TavernLogin;
