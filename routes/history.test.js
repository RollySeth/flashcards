const request = require("supertest");
var jwt = require("jsonwebtoken");

const server = require("../server");
const testUtils = require("../test-utils");

const User = require("../models/user");

describe("/history", () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);

  afterEach(testUtils.clearDB);

  
  describe("after login", () => {
    const user0 = {
      email: "user0@mail.com",
      password: "123password",
    };
    const user1 = {
      email: "user1@mail.com",
      password: "456password",
    };
    let token0;
    let adminToken;

    beforeEach(async () => {
      await request(server).post("/login/signup").send(user0);
      const res0 = await request(server).post("/login").send(user0);
      token0 = res0.body.token;
      await request(server).post("/login/signup").send(user1);
      await User.updateOne(
        { email: user1.email },
        { $push: { roles: "admin" } }
      );
      const res1 = await request(server).post("/login").send(user1);
      adminToken = res1.body.token;
    });

    describe("/user/history", () => {

      // GET cards in cardset
      it("GET should return history and return 200", async () => {
        const res = await request(server)
          .get("/user/history/")
          .set("Authorization", "Bearer " + token0)
        expect(res.statusCode).toEqual(200);
      });

      it("PUT should reset History and return 200", async () => {
        const res = await request(server)
          .put("/user/history/reset")
          .set("Authorization", "Bearer " + token0)
          .send()
        expect(res.statusCode).toEqual(200);
      });

    });
  });
});
