'use strict';
const dataAccessLayer = require('../sdk/db/dataAccessLayer.js');
const Joi = require('@hapi/joi');
const constants = require('../utilities/constants');
const {v4: uuidv4} = require('uuid');
const PROTO_PATH = __dirname + '/grpc.proto';
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  {keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });
const dejoule_proto = grpc.loadPackageDefinition(packageDefinition).dejoule;

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
      let res = await this.dataAccessLayer.saveDoc(body, constants['SITE_COLLECTION']);
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
    let body = await siteUpdateSchema.validateAsync(args);
    options.data = body;
    let res = await this.dataAccessLayer.editDoc(options, constants['SITE_COLLECTION']);
    return res;
  }

  async removeSite(args, context) {
    try {
      const response = await invokeGrpc('safeToDelete', {id: 'akJH3'});
      if (response.isSafe){
        let options = {query: {_id: args.id}};
        delete args['id'];
        options.data = args;
        let removeQUery = {query: {siteId: options.query._id}};
        await dataAccessLayer.removeManyDocs(removeQUery, constants['DEVICE_COLLECTION']);
        let res = await dataAccessLayer.removeDoc(options, constants['SITE_COLLECTION']);
        if (res){
          return res;
        } else {
          throw new Error('No such Site exists');
        }
      } else {
        throw new Error('Not safe to delete site');
      }
    } catch (err){
      console.log(err);
      throw err;
    }
  }
}

async function invokeGrpc(method, args){
  const client = new dejoule_proto.DejouleSite(process.env.DejouleUrl, grpc.credentials.createInsecure());
  const promise = new Promise((resolve, reject) => {
    client[method](args, async function(err, response) {
      if (err){
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
  return promise;
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

const siteUpdateSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required(),
});
module.exports = new Mutations();
