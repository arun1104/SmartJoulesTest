var assert = require('assert');
var chai = require('chai'),
    chaiHttp = require('chai-http');
chai.use(chaiHttp);
var mocha = require('mocha');
var describe = mocha.describe;
var it = mocha.it;
let req = { headers: {}, swagger: {} };
let serverUrl = 'https://localhost:3000';
let url = (process.env.apiUrl) ? process.env.apiUrl : serverUrl;
describe('getUsers positive suit', function() {
    it('should return 200 for valid req', async function() {
        var res = await chai.request(url).get('/v1/users?userId=123&index=0&count=10').set('Content-Type', 'application/json')
            .send();
        assert.equal(res.status, 200);
    });
});