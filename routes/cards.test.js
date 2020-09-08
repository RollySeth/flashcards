const request = require("supertest");
var jwt = require("jsonwebtoken");

const server = require("../server");
const testUtils = require("../test-utils");

const User = require("../models/user");
const Cards = require("../models/cards");
const Set = require("../models/set");

describe("/cards", () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);

  afterEach(testUtils.clearDB);

  const card0 = { sideA: "Text1", sideB: "Text1a", cardsAttempt: 0, setId: 1 };
  const card1 = { sideA: "Text2", sideB: "Text2a", cardsAttempt: 0, setId: 2 };

  const updatedCard = {
    sideA: "TextUpdated",
    sideB: "TextUpdated",
    cardsAttempt: 0,
    setId: 1,
  };
  const set0 = {
    title: "SetTitle0",
    description: "SetDescription0",
    category: "SetCategory0",
  };
  const set1 = {
    title: "SetTitle1",
    description: "SetDescription1",
    category: "SetCategory1",
  };
  const set0Public = {
    title: "SetTitle3",
    description: "SetDescription3",
    category: "SetCategory3",
    isPublic: true,
  };

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

    describe.each([card0])("Card Route Testing", (card) => {
      let cardSet;
      let cards;

      // POST and create CardSet and Cards
      beforeEach(async () => {
        const cardsRes = await request(server)
          .post("/set")
          .set("Authorization", "Bearer " + adminToken)
          .send(set0);
        cardSet = cardsRes.body;

        const setRes = await request(server)
          .post("/cards/" + cardSet._id)
          .set("Authorization", "Bearer " + token0)
          .send(card);
        cards = setRes.body;
      });

      // GET cards in cardset
      it("GET by CardSet ID should send 200 to admin user", async () => {
        const res = await request(server)
          .get("/cards/" + cardSet._id)
          .set("Authorization", "Bearer " + adminToken)
          .send();
        expect(res.statusCode).toEqual(200);
      });
      it("GET by CardSet ID should send 401 to normal user", async () => {
        const res = await request(server)
          .get("/cards/" + cardSet._id)
          .set("Authorization", "Bearer " + token0)
          .send();
        expect(res.statusCode).toEqual(401);
      });

      it("GET by Cards ID should send 200 to admin user", async () => {
        const res = await request(server)
          .get("/cards/" + cardSet._id + "/" + cards._id)
          .set("Authorization", "Bearer " + adminToken);
        expect(res.statusCode).toEqual(200);
      });

      it("GET by Cards ID should send 401 to normal user", async () => {
        const res = await request(server)
          .get("/cards/" + cardSet._id + "/" + cards._id)
          .set("Authorization", "Bearer " + token0);
        expect(res.statusCode).toEqual(401);
      });

      // UPDATE metadata of id
      it("PUT should send 200 to admin user", async () => {
        const res = await request(server)
          .put("/cards/" + cardSet._id + "/" + cards._id)
          .set("Authorization", "Bearer " + adminToken)
          .send(updatedCard);
        expect(res.statusCode).toEqual(200);
      });
      it("PUT should send 200 to normal user", async () => {
        const res = await request(server)
          .put("/cards/" + cardSet._id + "/" + cards._id)
          .set("Authorization", "Bearer " + token0)
          .send(updatedCard);
        expect(res.statusCode).toEqual(401);
      });

      it("DELETE should send 401 to normal user", async () => {
        const res = await request(server)
          .delete("/cards/delete/" + cardSet._id + "/" + cards._id)
          .set("Authorization", "Bearer " + token0)
          .send();
        expect(res.statusCode).toEqual(401);
      });
      it("DELETE should send 200 to admin user", async () => {
        const res = await request(server)
          .delete("/cards/delete/" + cardSet._id + "/" + cards._id)
          .set("Authorization", "Bearer " + adminToken)
          .send();
        expect(res.statusCode).toEqual(200);
      });
    });
  });
});
