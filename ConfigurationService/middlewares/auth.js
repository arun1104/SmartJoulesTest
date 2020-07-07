
'use strict';
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'private');
const jwt = require('jsonwebtoken');
module.exports.authMiddleware = function(req, res, next) {
  try {
    if (req.path.toLowerCase().includes('/files')){
      if (req.method === 'POST'){
        let cert = fs.readFileSync(filePath);
        let decoded = jwt.verify(req.headers.authorization, cert, { algorithms: ['RS256'] });
        console.log(decoded);
        next();
      } else {
        next();
      }
    } else if (req.swagger.security.length > 0){
      let cert = fs.readFileSync(filePath);
      let decoded = jwt.verify(req.headers.authorization, cert, { algorithms: ['RS256'] });
      console.log(decoded);
      next();
    } else {
      next();
    }

  } catch (err) {
    res.status(400).send({message: 'Invalid token'});
  }
};
