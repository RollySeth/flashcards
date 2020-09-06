const request = require("supertest");
var jwt = require("jsonwebtoken");

const server = require("../server");
const testUtils = require("../test-utils");

const User = require("../models/user");
const Set = require("../models/set");

describe("/set", () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);

  afterEach(testUtils.clearDB);

  const card0 = { sideA: "Text1", sideB: "Text1a", cardsAttempt: 0, setId: 1 };
  const card1 = { sideA: "Text2", sideB: "Text2a", cardsAttempt: 0, setId: 2 };
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

    describe.each([set0, set1])("POST / set %#", (set) => {
      it("should create new set", async () => {
        const res = await request(server)
          .post("/set/")
          .set("Authorization", "Bearer " + token0)
          .send(set);
        expect(res.statusCode).toEqual(200);
      });
    });

    // GET set of one user.
    describe("GET / user", () => {
      it("should send 200 to normal user", async () => {
        const user = await User.findOne({ email: user0.email });
        const res = await request(server)
          .get("/set/user/" + user._id)
          .set("Authorization", "Bearer " + token0)
          .send();
        expect(res.statusCode).toEqual(200);
      });
      it("should send 200 to admin user", async () => {
        const user = await User.findOne({ email: user1.email });
        const res = await request(server)
          .get("/set/user/" + user._id)
          .set("Authorization", "Bearer " + adminToken)
          .send();
        expect(res.statusCode).toEqual(200);
      });
    });

    // GET public sets
    describe("GET / public", () => {
      it("should send 200 to normal user", async () => {
        const res = await request(server)
          .get("/set/public/")
          .set("Authorization", "Bearer " + token0)
          .send();
        expect(res.statusCode).toEqual(200);
      });
      it("should send 200 to admin user", async () => {
        const res = await request(server)
          .get("/set/public/")
          .set("Authorization", "Bearer " + adminToken)
          .send();
        expect(res.statusCode).toEqual(200);
      });
    });

    // Update metadata of set
    describe.each([set0])("PUT / set %#", (set) => {
      let originalItem;
      beforeEach(async () => {
        const res = await request(server)
          .post("/set/")
          .set("Authorization", "Bearer " + adminToken)
          .send(set);
        originalItem = res.body;
      });
      it("should update set", async () => {
        const res = await request(server)
          .put("/set/" + originalItem._id)
          .set("Authorization", "Bearer " + adminToken)
          .send({
            setId: originalItem._id,
            title: "New Title",
            description: "Another Description",
            category: "New Category",
          });
        expect(res.statusCode).toEqual(200);
      });
    });

    // Change public status of set
    describe.each([set0Public])("PUT / public %#", (set) => {
      let originalItem;
      beforeEach(async () => {
        const res = await request(server)
          .post("/set/")
          .set("Authorization", "Bearer " + adminToken)
          .send(set);
        originalItem = res.body;
      });
      it("should not create new public set if not admin", async () => {
        const res = await request(server)
          .put("/set/public/" + originalItem._id)
          .set("Authorization", "Bearer " + token0)
          .send({ ...set, category: "New Category" });
        expect(res.statusCode).toEqual(401);
      });
      it("should create new public set", async () => {
        const res = await request(server)
          .put("/set/public/" + originalItem._id)
          .set("Authorization", "Bearer " + adminToken)
          .send({ ...set, category: "New Category" });
        expect(res.statusCode).toEqual(200);
      });
    });

    // GET single set
    describe("GET / :id", () => {
      let originalItem;
      beforeEach(async () => {
        const res = await request(server)
          .post("/set")
          .set("Authorization", "Bearer " + adminToken)
          .send(set0);
        originalItem = res.body;
      });
      it("should send 200 to admin user", async () => {
        const res = await request(server)
          .get("/set/" + originalItem._id)
          .set("Authorization", "Bearer " + adminToken)
          .send();
        expect(res.statusCode).toEqual(200);
      });
      it("should send 200 to normal user", async () => {
        const res = await request(server)
          .get("/set/" + originalItem._id)
          .set("Authorization", "Bearer " + token0)
          .send();
        expect(res.statusCode).toEqual(401);
      });
    });

    //PUT single set
    describe("POST / public %#", () => {
      let originalItem;
      beforeEach(async () => {
        const res = await request(server)
          .post("/set/")
          .set("Authorization", "Bearer " + adminToken)
          .send(set0Public);
        originalItem = res.body;
      });
      it("should not update a set if not admin", async () => {
        const res = await request(server)
          .post("/set/start/" + originalItem._id)
          .set("Authorization", "Bearer " + token0)
          .send({setAttempts: set0Public.setAttempts + 1 });
        expect(res.statusCode).toEqual(404);
      });
      // it("should update a single set", async () => {
      //   const res = await request(server)
      //     .post("/set/start/" + originalItem._id)
      //     .set("Authorization", "Bearer " + adminToken)
      //     .send({setAttempts: set0Public.setAttempts + 1 });
      //   expect(res.statusCode).toEqual(200);
      //});
    });

    // Delete
    describe("DELETE / :id", () => {
      let createdItem;
      beforeEach(async () => {
        const res = await request(server)
          .post("/set")
          .set('Authorization', 'Bearer ' + adminToken)
          .send(set0Public);
        createdItem = res.body;
      });
      it("should send 400 to normal user", async () => {
        const res = await request(server)
          .delete("/set/" + createdItem._id)
          .set("Authorization", "Bearer " + token0)
          .send(createdItem);
        expect(res.statusCode).toEqual(400);
      });
      it("should send 200 to admin user", async () => {
        const originalSet = await Set.findOne({ title: set0.title });
        const res = await request(server)
          .delete("/set/" + createdItem._id)
          .set("Authorization", "Bearer " + adminToken)
          .send(createdItem);
        expect(res.statusCode).toEqual(200);
      });
    });
  });
});
