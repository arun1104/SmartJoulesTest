'use strict';
var assert = require('assert');
const axios = require('axios');

var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var mocha = require('mocha');
let describe;
let it;
if (mocha.describe) {
  describe = mocha.describe;
  it = mocha.it;
} else {
  describe = global.describe;
  it = global.it;
}
let serverUrl = 'http://localhost/v1';
let url = (process.env.apiUrl) ? process.env.apiUrl : serverUrl;
describe('create category positive suit', function() {
  it('should return 200 for valid req', async function() {
    var axios = require('axios');
    var data = JSON.stringify([{_id: 'Food', children: ['Grain', 'Vegetables', 'Fruits'], ancestors: []}, {_id: 'Grain', children: ['Rice', 'Wheat'], ancestors: ['Food']}, {_id: 'Vegetables', children: ['Potato', 'Garlic'], ancestors: ['Food']}, {_id: 'Fruits', children: ['Grapes', 'Apple'], ancestors: ['Food']}, {_id: 'Rice', children: [], ancestors: ['Grain', 'Food']}, {_id: 'Wheat', children: [], ancestors: ['Grain', 'Food']}, {_id: 'Potato', children: [], ancestors: ['Food', 'Vegetables']}, {_id: 'Garlic', children: [], ancestors: ['Food', 'Vegetables']}, {_id: 'Grapes', children: [], ancestors: ['Food', 'Fruits']}, {_id: 'Apple', children: [], ancestors: ['Food', 'Fruits']}]);
    var config = {
      method: 'post',
      url: 'http://192.168.2.4/v1/categories',
      headers: {
        'Content-Type': 'application/json',
        Cookie: 'access_token=undefined',
      },
      data: data,
    };

    axios(config)
      .then(function(response) {
        console.log(JSON.stringify(response.data));
        assert.equal(response.status, 200);
      })
      .catch(function(error) {
        assert.fail(error);
        console.log(error);
      });


  });
});
