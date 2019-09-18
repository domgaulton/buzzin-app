import React, { useState } from 'react';
import { firestore } from "../base";

function Tavern(props) {

  const [tavernName, setTavernName] = useState('');
  const [countdown, setCountdown] = useState(undefined);
  const [membersReady, setMembersReady] = useState(false);
  const [memberSet, setMembers] = useState([]);

  // - WORKING - https://firebase.google.com/docs/firestore/quickstart
  firestore.collection("taverns").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
    });
  });

  // https://firebase.google.com/docs/firestore/query-data/listen
  firestore.collection("taverns").doc(props.match.params.tavernId)
    .onSnapshot({
      // Listen for document metadata changes
      includeMetadataChanges: true
    }, function(doc) {
      const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
      console.log(source, " data: ", doc.data());

      const tavernName = doc.data().name;
      console.log(tavernName);
      setTavernName(tavernName);

      const members = doc.data().members;
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
    </div>
  );

}

export default Tavern;
