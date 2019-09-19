import React, { useState } from 'react';
import { firestore } from "../base";

function TavernLogin(props) {

  const [pinNo, set_pinNo] = useState();

  // https://firebase.google.com/docs/firestore/query-data/listen
  firestore.collection("taverns").doc(props.tavernId)
    .onSnapshot({
      // Listen for document metadata changes
      includeMetadataChanges: true
    }, function(doc) {
      const pin = doc.data().pin;
      console.log(pin)
      set_pinNo(pin);
  });

  const checkPin = (e) => {
    if (Number(e.currentTarget.value) === pinNo){
      console.log('true')
      props.pinEntered(true);
    }

  }

  return (
    <React.Fragment>
      <h1>Enter Pin</h1>
      <input type='number' placeholder='enter pin' onChange={e => checkPin(e)} />
    </React.Fragment>
  );

}

export default TavernLogin;
