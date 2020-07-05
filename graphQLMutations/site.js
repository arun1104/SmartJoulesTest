'use strict';
const { DataAccessLayer } = require('../sdk/db/dataAccessLayer.js');
let dataAccessLayer = new DataAccessLayer();

class Mutations {

  constructor(dbLayer = dataAccessLayer) {
    this.dataAccessLayer = dbLayer;
    this.newSite = this.newSite.bind(this);
    this.editSite = this.editSite.bind(this);
    this.removeSite = this.removeSite.bind(this);
  }
  async newSite(args, context) {
    let res = await dataAccessLayer.saveDoc(args);
    return res;
  }

  async editSite(args, context) {
    let res = await dataAccessLayer.editDoc(args);
    return res;
  }

  async removeSite(args, context) {
    let res = await dataAccessLayer.removeDoc(args);
    return res;
  }
}

module.exports = {
  Mutations,
};
