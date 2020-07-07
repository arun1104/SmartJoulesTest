
'use strict';
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'private');
const jwt = require('jsonwebtoken');
module.exports.authMiddleware = function(req, res, next) {
  try {
    let cert = fs.readFileSync(filePath);
    let decoded = jwt.verify(req.headers.authorization, cert, { algorithms: ['RS256'] });
    console.log(decoded);
    next();
  } catch (err) {
    res.status(400).send({message: 'Invalid token'});
  }
};
