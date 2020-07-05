'use strict';
const { DataAccessLayer } = require('../sdk/db/dataAccessLayer.js');
const Joi = require('@hapi/joi');
let dataAccessLayer = new DataAccessLayer();
const constants = require('../utilities/constants');
const {v4: uuidv4} = require('uuid');

class Mutations {

  constructor(dbLayer = dataAccessLayer) {
    this.dataAccessLayer = dbLayer;
    this.newSite = this.newSite.bind(this);
    this.editSite = this.editSite.bind(this);
    this.removeSite = this.removeSite.bind(this);
  }
  async newSite(args, context) {
    try {
      let body = await siteSchema.validateAsync(args);
      body._id = uuidv4();
      let res = await dataAccessLayer.saveDoc(body, constants['SITE_COLLECTION']);
      res.id = res._id;
      delete res['_id'];
      return res;
    } catch (err){
      console.log(err);
      let error = new Error();
      if (err.status && err.message) {
        error.message = {details: err.message, status: err.status};
      } else if (err.message) {
        error.message = {details: err.message, status: 400};
      } else {
        error.status = 500;
        error.message = {details: err.message, status: 500};
      }
      throw error;
    }
  }

  async editSite(args, context) {
    let options = {query: {_id: args.id}};
    delete args['id'];
    options.data = args;
    let res = await dataAccessLayer.editDoc(options, constants['SITE_COLLECTION']);
    return res;
  }

  async removeSite(args, context) {
    let res = await dataAccessLayer.removeDoc(args);
    return res;
  }
}

const siteSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required(),
  industry: Joi.string().valid('hospital', 'papermill', 'cement').required(),
  location: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required(),
});
module.exports = {
  Mutations,
};
