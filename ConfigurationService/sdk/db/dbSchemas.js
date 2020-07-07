'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const siteSchema = new Schema({
  _id: { type: String, trim: true, required: true },
  location: { type: String, trim: true, required: true },
  industry: { type: String, trim: true, required: true },
  name: { type: String, trim: true, required: true },
}, { strict: false, timestamps: true });

mongoose.model('sites', siteSchema, 'sites');

const deviceSchema = new Schema({
  _id: { type: Number, required: true },
  name: { type: String, trim: true, required: true },
  siteId: { type: String, trim: true, required: true },
  isOnline: { type: Boolean },
}, { strict: false, timestamps: true });

mongoose.model('devices', deviceSchema, 'devices');
