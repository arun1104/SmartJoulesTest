'use strict';
const { DataAccessLayer } = require('../sdk/db/dataAccessLayer.js');
const constants = require('../utilities/constants');
let dataAccessLayer = new DataAccessLayer();

class Resolvers {
  constructor(dbLayer = dataAccessLayer) {
    this.dataAccessLayer = dbLayer;
    this.getSite = this.getSite.bind(this);

  }
  async getSite(args, context) {
    let res = await this.dataAccessLayer.getDocs(args, constants['SITE_COLLECTION']);
    return res[0];
  }
}
Resolvers.dataAccessLayer = dataAccessLayer;
module.exports = {
  Resolvers,
};
