import React, { useState } from 'react';
import { firestore } from "../base";

function TavernRoom(props) {

  let members = [];


  const [tavernName, setTavernName] = useState('');
  const [countdown, setCountdown] = useState(undefined);
  const [membersReady, setMembersReady] = useState(false);
  const [memberSet, setMembers] = useState([]);
  const [pinNo, set_pinNo] = useState(undefined);
  const [pinCorrect, set_pinCorrect] = useState(false);

  firestore.collection("taverns").doc(props.match.params.tavernId).get().then((querySnapshot) => {
    console.log(querySnapshot.data().options.pin)
    set_pinNo(querySnapshot.data().options.pin);
  });

  // const pin = () => {
  //   firestore.collection("taverns").doc(props.match.params.tavernId).get().then((querySnapshot) => {
  //     return querySnapshot.data().options.pin;
  //   });
  // }

  // const pin = () => {
  //   firestore.collection("taverns").doc(props.match.params.tavernId).get().then((querySnapshot) => querySnapshot.data().options.pin);
  // }

  const pin = () => {
    firestore.collection("taverns").doc(props.match.params.tavernId).get().then(function(doc) {
      if (doc.exists) {
          const pinNo = doc.data().options.pin
          console.log("Document data:", pinNo);
          console.log(typeof pinNo)
          set_pinNo(pinNo);
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
  }

//   const pin = () => {
//     firestore.collection("taverns").document(props.match.params.tavernId).getDocument { (document, err) in
//         if let document = document, document.exists {
//             // We got a document from Firebase. It'd be better to
//             // handle the initialization gracefully and report an Error
//             // instead of force unwrapping with !
//             let strings = (UserInformationDocument(dictionary: document.data()!)?.lists!)!
//             completion(strings, nil)
//         } else if let error = error {
//             // Firebase error ie no internet
//             completion(nil, error)
//         }
//         else {
//             // No error but no document found either
//             completion(nil, nil)
//         }
//     }
// }

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
      <p>Pin: {pinNo}</p>
    </div>
  );
}

export default TavernRoom;
