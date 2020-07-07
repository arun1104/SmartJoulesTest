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
    this.newDevice = this.newDevice.bind(this);
    this.editDevice = this.editDevice.bind(this);
    this.removeDevice = this.removeDevice.bind(this);
  }
  async newDevice(args, context) {
    try {
      let body = await deviceSchema.validateAsync(args);
      let lastDevice = await this.dataAccessLayer.getLastDoc(constants['DEVICE_COLLECTION']);
      if (lastDevice.length > 0){
        body._id = ++lastDevice[0]._id;
      } else {
        body._id = 1;
      }
      let res = await this.dataAccessLayer.saveDoc(body, constants['DEVICE_COLLECTION']);
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

  async editDevice(args, context) {
    let options = {query: {_id: args.id}};
    delete args['id'];
    options.data = args;
    let res = await this.dataAccessLayer.editDoc(options, constants['DEVICE_COLLECTION']);
    return res;
  }

  async removeDevice(args, context) {
    try {
      const response = await invokeGrpc('safeToDelete', {id: 'akJH3'});
      if (response.isSafe){
        let options = {query: {_id: args.id}};
        delete args['id'];
        options.data = args;
        let res = await dataAccessLayer.removeDoc(options, constants['DEVICE_COLLECTION']);
        if (res){
          return res;
        } else {
          throw new Error('No such Device exists');
        }
      } else {
        throw new Error('Not safe to delete device');
      }
    } catch (err){
      console.log(err);
      throw err;
    }
  }
}

async function invokeGrpc(method, args){
  const client = new dejoule_proto.DejouleDevice(process.env.DejouleUrl, grpc.credentials.createInsecure());
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

const deviceSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required(),
  siteId: Joi.string().required(),
  isOnline: Joi.boolean(),
});
module.exports = new Mutations();
