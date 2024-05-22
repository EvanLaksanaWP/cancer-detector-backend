const tf = require('@tensorflow/tfjs-node');
const PredictionError = require('../exceptions/PredictionError');

async function predictClassification(model, image) {
  try{
    const tensor = tf.node
      .decodeJpeg(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat();

    const prediction = model.predict(tensor);
    const score = await prediction.data();

    const result = score[0] <= 0.5 ? "Non-cancer" : "Cancer";
    return result;

  } catch(error){
    throw new PredictionError('Terjadi kesalahan dalam melakukan prediksi');
  }
}

module.exports = predictClassification;