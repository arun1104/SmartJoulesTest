'use strict';
var assert = require('assert');
var mocha = require('mocha');
var sinon = require('sinon');
let describe;
let it;
if (mocha.describe) {
  describe = mocha.describe;
  it = mocha.it;
} else {
  describe = global.describe;
  it = global.it;
}
let dbLayer = require('../../../utilities/mongodbLayer');

describe('insert many positive suit', async function() {
  it('should return valid values', async function() {
    dbLayer.Mongoose = {};
    dbLayer.Mongoose.connect = sinon.stub();
    dbLayer.Mongoose.model = sinon.stub();
    dbLayer.Mongoose.connect.resolves();
    let insertManyMock = sinon.stub();
    insertManyMock.resolves({prodId: 1});
    dbLayer.Mongoose.model.returns({insertMany: insertManyMock});
    try {
      let reqObj = { userId: '123' };
      let result = await dbLayer.insertMany({data: [{ data: reqObj }]}, '7i68gduygwduvwd', 'category');
      assert.equal(result.prodId, 1);
    } catch (err) {
      assert.fail('Exception in getReviewsDBLayer Positive suit');
    }
  });
});
