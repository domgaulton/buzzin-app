import { firestore } from "../base";

const tavernsApi = tavernId => {
    firestore.collection("taverns").doc(tavernId)
    .onSnapshot({
      // Listen for document metadata changes
      includeMetadataChanges: true
    }, function(doc) {
      const pin = doc.data().pin;
      // console.log(pin)
      return pin;
  });
}

const tavernsTest = tavernId => {
  const item = firestore.collection("taverns").doc(tavernId).get().then(function(doc) {
      // Document was found in the cache. If no cached document exists,
      // an error will be returned to the 'catch' block below.
      console.log("Cached document data:", doc.data());
      return doc.data().pin;
  }).catch(function(error) {
      console.log("Error getting cached document:", error);
  })
  console.log(typeof item)
}

export { tavernsApi, tavernsTest };
