var assert = require('assert');
var mocha = require('mocha');
var sinon = require('sinon');
let describe;
let it;
let before;
let after;
if (mocha.describe) {
    describe = mocha.describe;
    it = mocha.it;
    before = mocha.before;
    after = mocha.after;
} else {
    describe = global.describe;
    it = global.it;
    before = global.before;
    after = global.after;
}
let dbLayer = require('../../../utilities/mongodbLayer');

describe('getProductReviews positive suit', async function() {
    it('should return valid values', async function() {
        dbLayer.Mongoose = {};
        dbLayer.Mongoose.connect = sinon.stub();
        dbLayer.Mongoose.model = sinon.stub();
        dbLayer.Mongoose.connect.resolves({
            avg: [{ avgRating: 1.3 }],
            individualRatingCount: [{ rating: 1, count: 5 }],
            reviews: [{
                email: "hAGShjsa",
                rating: 2,
                review: "hgjhsd"
            }]
        });
        dbLayer.Mongoose.model.returns(function() {
            this.save = sinon.stub();
            this.save.resolves({});
            this.userId = "123";
        });
        try {
            let reqObj = { userId: "123" };
            let result = await dbLayer.createDoc({ data: reqObj }, "7i68gduygwduvwd", "User");
            assert.equal(result.userId, "123");
        } catch (err) {
            assert.fail("Exception in getReviewsDBLayer Positive suit")
        }
    });
});