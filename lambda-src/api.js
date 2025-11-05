// lambda-src/api.js
const serverless = require('serverless-http');
const { app } = require('../server');

// We are exporting the express app wrapped in serverless-http
// as a lambda handler.
module.exports.handler = serverless(app);