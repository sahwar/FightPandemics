const httpStatus = require("http-status");
const APP_URL = process.env.MOCHA_URL;
const apiHelper = require("../utils/apiHelper");
const apiEndPointHelper = require("../utils/apiEndpoints");
const validator = require("../utils/validators");
let getPostApiEndpoint = apiEndPointHelper.postsEndpoint;
const dbHelper = require("../utils/dbHelper");
const ObjectID = require("mongodb").ObjectID;
const authorID = new ObjectID();
const authorName = "Sourced by FightPandemics (Testers)";
let postID = 0;
let insertResult = [];

const post = {
  airtableId: "rec00UgojtQL4VGNw",
  author: {
    id: authorID,
    name: authorName,

    photo:
      "https://raw.githubusercontent.com/FightPandemics/FightPandemics/master/images/fp_logo.png",

    type: "Community",

    location: {
      address: "Portland, OR, USA",
      coordinates: [-122.6750261, 45.5051064],
      city: "Portland",
      state: "OR",
      country: "US",
    },
  },
  content:
    "Testers Mutual Aid Network is intended to distribute resources from local people to those who are vulnerable and in need in the area",
  createdAt: new Date(),
  externalLinks: {
    website: "https://www.facebook.com/groups/1502826939890243/",
  },
  language: ["English"],
  likes: [],
  objective: "offer",
  title: "Testers South FL Mutual Aid",
  types: ["Information"],
  updatedAt: new Date(),
  visibility: "worldwide",
};
describe("GET /api/posts/{postId} endpoint - for a user that is NOT signed in", function () {
  describe("GET /api/posts/{postId} endpoint - record is added to the DB and then retrieved using API", function () {
    before(function () {
      dbHelper.connectToDatabase();
    });
    beforeEach(function (done) {
      dbHelper.insertDocument(post, "posts").then((result) => {
        postID = result.insertedId;
        insertResult = result.ops;
        done();
      });
    });
    afterEach(function (done) {
      dbHelper.deleteDocument("posts", { _id: postID });
      done();
    });

    after(function () {
      dbHelper.disconnect();
    });

    it("Success - user gets a post by ID", async function () {
      let response = await apiHelper.sendGETRequest(
        APP_URL,
        getPostApiEndpoint + "/" + postID,
      );
      validator.validateResponse(response, {
        statusCode: httpStatus.OK,
        ok: true,
      });
      validator.validateInitialAndResponseObject(
        insertResult[0],
        ["author.location", "author.id", "createdAt", "updatedAt", "_id"],
        response.body.post,
        [
          "author.location",
          "author.id",
          "elapsedTimeText",
          "liked",
          "likesCount",
          "createdAt",
          "updatedAt",
          "_id",
          "reportsCount",
          "commentsCount",
          "isEdited",
          "status",
        ],
      );
    });
  });

  describe("GET /api/posts/{postId} endpoint - error when using incorrect ObjectID", function () {
    it("404 error - post was not found by random mongodb ObjectID", async function () {
      var objectId = new ObjectID();
      let response = await apiHelper.sendGETRequest(
        APP_URL,
        getPostApiEndpoint + "/" + objectId,
      );
      validator.validateResponse(response.body, {
        statusCode: httpStatus.NOT_FOUND,
        error: "Not Found",
        message: "Not Found",
      });
    });
    //Skip. Issue [API] - endpoint GET /api/posts/{postId} #2088 was created.
    it.skip("404 error - post was not found by value that is NOT ObjectID", async function () {
      let response = await apiHelper.sendGETRequest(
        APP_URL,
        getPostApiEndpoint + "/" + 1,
      );
      validator.validateResponse(response.body, {
        statusCode: httpStatus.NOT_FOUND,
        error: "Not Found",
        message: "Not Found",
      });
    });
  });
});
