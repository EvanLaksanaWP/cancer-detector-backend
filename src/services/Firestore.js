const { Firestore } = require('@google-cloud/firestore');

const db = new Firestore();
const predictCollection = db.collection('prediction');


const storeData = async (id, data) => {
  predictCollection.doc(id).set(data);
}

async function fetchAllPredictions() {
  const snapshot = await predictCollection.get();
  const predictions = [];
  snapshot.forEach(doc => {
      predictions.push({ id: doc.id, ...doc.data() });
  });
  return predictions; 
}

module.exports = {storeData, fetchAllPredictions};