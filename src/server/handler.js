const predict = require('../services/inferenceService');
const { storeData, fetchAllPredictions } = require('../services/Firestore');


async function predictHandler (request, h){

  const { image } = request.payload;
  const { model } = request.server.app;

  const result  = await predict(model, image);
  const id = crypto.randomUUID();
  const createdAt = new Date().toString();

  const suggestion = result === "Cancer" ? "Please consult a doctor immediately." : "There is no indication of cancer, but please consult a doctor for an additional checkup.";

  const data = {
    "id": id,
    "result": result,
    "suggestion": suggestion,
    "createdAt": createdAt
  }

  await storeData(id, data);

  const response = h.response({
    "status": "success",
    "message": "Model is predicted successfully",
    data,
  }).code(201);
  
  return response;
}

async function historyHandler(request, h) {

  const Historydata = await fetchAllPredictions();

  const response = h.response({
    "status": "success",
    "data": Historydata,
  }).code(200);

  return response;
}


module.exports = { predictHandler, historyHandler };