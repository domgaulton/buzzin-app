import React, { useState } from 'react';
import TavernLogin from './TavernLogin';
import TavernRoom from './TavernRoom';
import { firestore } from "../base";

function Tavern(props) {

  let members = [];


  const [tavernName, setTavernName] = useState('');
  const [countdown, setCountdown] = useState(undefined);
  const [membersReady, setMembersReady] = useState(false);
  const [memberSet, setMembers] = useState([]);
  const [pinCorrect, set_pinCorrect] = useState(false);

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

  return pinCorrect ? (
    <TavernRoom tavernId={props.match.params.tavernId} />
  ) : (
    <TavernLogin tavernId={props.match.params.tavernId} />
  );

}

export default Tavern;
