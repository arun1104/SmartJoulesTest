'use strict';
let authenticationHandler = require('./controllers/authentication/expressHandler');

module.exports = {
  login: authenticationHandler.loginRequesthandler,
};
