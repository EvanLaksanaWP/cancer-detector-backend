require('dotenv').config();

const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const loadModel = require('../services/loadModel');
const PredictionError = require('../exceptions/PredictionError');

(async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  const model = await loadModel();

  server.app.model = model;

  server.ext('onPreResponse', (request, h) => {
    const response = request.response;

    if (response.isBoom && response.output.statusCode === 413) {
      return h.response({
        "status": "fail",
        "message": "Payload content length greater than maximum allowed: 1000000",
      }).code(response.output.statusCode);
    }

    if (response instanceof PredictionError) {
      return h.response({
        "status": "fail",
        "message": response.message,
      }).code(response.statusCode);
    }

    if (response.isBoom) {
      return h.response({
        status: 'fail',
        message: response.message
      }).code(500)
    }

    return h.continue;
  });

  server.route(routes);

  await server.start();
  console.log(`Server start at: ${server.info.uri}`);
})();