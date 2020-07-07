'use strict';
const dataAccessLayer = require('../sdk/db/dataAccessLayer.js');
const constants = require('../utilities/constants');

class Resolvers {
  constructor(dbLayer = dataAccessLayer) {
    this.dataAccessLayer = dbLayer;
    this.getDevice = this.getDevice.bind(this);
    this.getDevices = this.getDevices.bind(this);

  }
  async getDevice(args, context) {
    if (args.id){
      args._id = args.id;
      delete args['id'];
    }
    let options = {index: 0, count: 1, query: args};
    let res = await this.dataAccessLayer.getDocs(options, constants['DEVICE_COLLECTION']);
    return res[0];
  }

  async getDevices(args) {
    let options = {index: args.index || 0, count: args.pageSize || 30};
    let res = await this.dataAccessLayer.getDocs(options, constants['DEVICE_COLLECTION']);
    return res;
  }

}

// Resolvers.dataAccessLayer = dataAccessLayer;
module.exports = new Resolvers();
