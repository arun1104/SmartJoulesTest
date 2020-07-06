'use strict';
const {
  loginSchema,
} = require('./hapiSchemas/schemas');
const crypto = require('crypto');
const constants = require('../../utilities/constants');
const Logger = require('../../utilities/logger');
const jwt = require('jsonwebtoken');
let fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'private');
class ExpressHandler {
  constructor() {
    this.loginRequesthandler = this.loginRequesthandler.bind(this);
    this.createHash = this.createHash.bind(this);
    this.createJwtToken = this.createJwtToken.bind(this);
  }

  createJwtToken(grps) {
    const privateKey = fs.readFileSync(filePath);
    let jwtToken = jwt.sign({
      iat: Math.floor(Date.now() / 1000) - 30,
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
      role: grps,
    }, privateKey, { algorithm: 'RS256' });
    return jwtToken;
  }

  createHash(value){
    const hash = crypto.createHash('md5').update(value).digest('hex');
    return hash;
  }
  async loginRequesthandler(req, res) {
    const correlationId = req.correlationId();
    const logger = new Logger(correlationId, 'loginRequesthandler-expressHandler', 'loginRequesthandler');
    logger.info('Entry');
    try {
      const reqBody = await loginSchema.validateAsync(req.body);
      const userNameHash = this.createHash(reqBody.userName);
      if (userNameHash === constants['USER_NAME']){
        const passHash = this.createHash(reqBody.password);
        if (passHash === constants['USER_PASSWORD']){
          let token = this.createJwtToken(['config', 'dejoule']);
          res.set({ 'content-type': 'application/json' });
          res.status(200).send({token});
        } else {
          throw new Error('Bad request');
        }
      } else {
        throw new Error('Bad request');
      }
    } catch (err) {
      if (err.status && err.message) {
        res.status(err.status).send({ message: err.message });
      } else if (err.message) {
        res.status(400).send({ message: err.message }); // JOI validation error
      } else {
        res.status(500).send({ message: 'Unexpected error' });
      }

    }
  }
}

module.exports = new ExpressHandler();
