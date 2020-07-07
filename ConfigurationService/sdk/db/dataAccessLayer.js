'use strict';
const mongoose = require('mongoose');
require('./dbSchemas');
const util = require('util');
class DataAccessLayer {
  constructor() {
    this.mongoose = mongoose;
    this.getDocs = this.getDocs.bind(this);
    this.editDoc = this.editDoc.bind(this);
    this.saveDoc = this.saveDoc.bind(this);
    this.removeDoc = this.removeDoc.bind(this);
    this.getLastDoc = this.getLastDoc.bind(this);
  }

  async getLastDoc(modelName) {
    try {
      let connectionString = `${process.env.mongoUrl}/${process.env.dbName}`;
      await this.mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
      let model = this.mongoose.model(modelName);
      let result = await model.find().sort({_id: -1}).limit(1);
      return result;
    } catch (error) {
      console.log('Error on getLastDoc');
      return [];
    }
  }

  async removeDoc(options, modelName) {
    try {
      let connectionString = `${process.env.mongoUrl}/${process.env.dbName}`;
      await this.mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
      let model = this.mongoose.model(modelName);
      let result = await model.findOneAndDelete(options.query);
      return result;
    } catch (error) {
      console.log('Error on editDoc');
      return [];
    }
  }

  async editDoc(options, modelName) {
    try {
      let connectionString = `${process.env.mongoUrl}/${process.env.dbName}`;
      await this.mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
      let model = this.mongoose.model(modelName);
      let result = await model.findOneAndUpdate(options.query, options.data, { new: true });
      return result;
    } catch (error) {
      console.log('Error on editDoc');
      return [];
    }
  }

  async getDocs(options, modelName) {
    try {
      let connectionString = `${process.env.mongoUrl}/${process.env.dbName}`;
      await this.mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
      let model = this.mongoose.model(modelName);
      if (options.query){
        const res = await model.find(options.query).sort({ name: 1 }).skip(options.index).limit(options.count);
        return res;
      } else {
        const res = await model.find({}).sort({ name: 1 }).skip(options.index).limit(options.count);
        return res;
      }
    } catch (error) {
      console.log('Error on get docs of DB');
      return [];
    }
  }

  async saveDoc(data, modelName) {
    try {
      let connectionString = `${process.env.mongoUrl}/${process.env.dbName}`;
      await this.mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
      let Model = this.mongoose.model(modelName);
      let newDoc = new Model(data);
      let result = JSON.parse(JSON.stringify(newDoc));
      await newDoc.save();
      return result;
    } catch (error) {
      console.log('Error on save docs of DB: ' + util.inspect(error, null));
      throw new Error(error.message);
    }
  }
}

module.exports = new DataAccessLayer();
