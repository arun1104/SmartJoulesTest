'use strict';
const mongoose = require('mongoose');
require('./dbSchemas');
const util = require('util');
class DataAccessLayer {
  constructor() {
    this.mongoose = mongoose;
  }
  async getDocs(query, modelName) {
    try {
      let connectionString = `${process.env.mongoUrl}/${process.env.dbName}`;
      await this.mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
      let model = this.mongoose.model(modelName);
      const res = await model.find(query);
      return res;
    } catch (error) {
      console.log('Error on get docs of DB');
      return [];
    }
  }
  async saveDoc(options, modelName) {
    try {
      let connectionString = `${process.env.mongoUrl}/${process.env.dbName}`;
      await this.mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
      let Model = this.mongoose.model(modelName);
      let newDoc = new Model(options.data);
      let result = JSON.parse(JSON.stringify(newDoc));
      await newDoc.save();
      return result;
    } catch (error) {
      console.log('Error on save docs of DB: ' + util.inspect(error, null));
      throw new Error(error.message);
    }
  }
}

module.exports = { DataAccessLayer };
