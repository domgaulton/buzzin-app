import React, { useState } from 'react';
import { firestore } from "../base";

function Tavern() {

  const [tavernName, setTavernName] = useState('');
  const [countdown, setCountdown] = useState(undefined);
  const [membersReady, setMembersReady] = useState(false);

  // - WORKING - https://firebase.google.com/docs/firestore/quickstart
  firestore.collection("taverns").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
    });
  });

  // https://firebase.google.com/docs/firestore/query-data/listen
  firestore.collection("taverns").doc('another-tavern')
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
      console.log(members);
      console.log(membersReady);
      setMembersReady(membersReady);

      const countdown = doc.data().options.countdown;
      setCountdown(countdown)
  });

  return (
    <div>
      <h1>{tavernName}</h1>
      <p>Members are {!membersReady ? 'not' : ''} ready!</p>
    </div>
  );

}

export default Tavern;
