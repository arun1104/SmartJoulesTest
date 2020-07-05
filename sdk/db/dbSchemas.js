'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const siteSchema = new Schema({
  id: { type: String, trim: true, required: true },
  location: { type: String, trim: true, required: true },
  industry: { type: String, trim: true, required: true },
  name: { type: String, trim: true, required: true },
}, { strict: false, timestamps: true });

siteSchema.index({
  id: 1,
}, {
  unique: true,
});
mongoose.model('sites', siteSchema, 'sites');

const deviceSchema = new Schema({
  name: { type: String, trim: true, required: true },
  siteId: { type: String, trim: true, required: true },
  isOnline: { type: Boolean, required: true },
}, { strict: false, timestamps: true });

mongoose.model('devices', deviceSchema, 'devices');
