import React, { useState } from 'react';
import { firestore } from "../base";

function Tavern(props) {

  let members = [];


  const [tavernName, setTavernName] = useState('');
  const [countdown, setCountdown] = useState(undefined);
  const [membersReady, setMembersReady] = useState(false);
  const [memberSet, setMembers] = useState([]);

  firestore.collection("taverns").doc(props.match.params.tavernId).get().then((querySnapshot) => {
    console.log(querySnapshot.data().options.pin)
  });

  // const pin = () => {
  //   firestore.collection("taverns").doc(props.match.params.tavernId).get().then((querySnapshot) => {
  //     return querySnapshot.data().options.pin;
  //   });
  // }

  const pin = () => {
    firestore.collection("taverns").doc(props.match.params.tavernId).get().then((querySnapshot) => querySnapshot.data().options.pin);
  }

  // https://firebase.google.com/docs/firestore/query-data/listen
  firestore.collection("taverns").doc(props.match.params.tavernId)
    .onSnapshot({
      // Listen for document metadata changes
      includeMetadataChanges: true
    }, function(doc) {
      const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
      // console.log(source, " data: ", doc.data());

      const pin = doc.data().options.pin;

      const tavernName = doc.data().name;
      // console.log(tavernName);
      setTavernName(tavernName);

      members = doc.data().members;
      console.log(members)
      const membersReady = members.every(item => {
        return item.ready === true;
      })

      setMembersReady(membersReady);

      const countdown = doc.data().options.countdown;
      setCountdown(countdown)
  });

  return (
    <div>
      <h1>{tavernName}</h1>
      <p>Time limit: {countdown}</p>
      <p>Members are {!membersReady ? 'not' : ''} ready!</p>
      <p>Pin: {pin()}</p>
    </div>
  );

}

export default Tavern;
