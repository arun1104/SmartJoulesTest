'use strict';
const dataAccessLayer = require('../sdk/db/dataAccessLayer.js');
const constants = require('../utilities/constants');

class Resolvers {
  constructor(dbLayer = dataAccessLayer) {
    this.dataAccessLayer = dbLayer;
    this.getSite = this.getSite.bind(this);
    this.getSites = this.getSites.bind(this);

  }
  async getSite(args, context) {
    if (args.id){
      args._id = args.id;
      delete args['id'];
    }
    let options = {index: 0, count: 1, query: args};
    let res = await this.dataAccessLayer.getDocs(options, constants['SITE_COLLECTION']);
    return res[0];
  }

  async getSites(args) {
    let options = {index: args.index || 0, count: args.pageSize || 30};
    let res = await this.dataAccessLayer.getDocs(options, constants['SITE_COLLECTION']);
    return res;
  }

}

// Resolvers.dataAccessLayer = dataAccessLayer;
module.exports = {
  Resolvers,
};
