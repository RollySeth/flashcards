const { Router } = require("express");
const router = Router();
const setDAO = require("../daos/set");
const userDAO = require("../daos/user");
const historyDAO = require("../daos/history");
const secret = "shhhhhh do not tell anyone this secret";
const jwt = require("jsonwebtoken");

const authorizationCheck = async (req, res, next) => {
  let header = req.headers.authorization;
  if (!header) {
    res.status(401).send("token unverified");
  } else {
    const token = header.split(" ")[1];
    const userCheck = jwt.verify(token, secret, (e, tokenNew) => {
      if (e) {
        res.status(401).send("user unverified");
      } else {
        res.locals.user = tokenNew;
        next();
      }
    });
  }
  return;
};

router.post("/", authorizationCheck, async (req, res, next) => {
  const { title, description, category } = req.body;
  const userId = res.locals.user._id;
  const set = await setDAO.create(title, description, category, userId);
  if (set) {
    res.json(set);
  } else {
    res.status(404).send("set not created");
  }
});

// GET set of one user.
router.get("/user/:userid", authorizationCheck, async (req, res, next) => {
  const userid = req.params.userid;
  if (
    res.locals.user.roles.includes("admin") ||
    res.locals.user._id == userid
  ) {
    const set = await setDAO.getSetsByUserId(userid);

    if (set) {
      res.json(set);
    } else {
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(401);
  }
}); 

// GET public sets
router.get("/public", authorizationCheck, async (req, res, next) => {
  const number = req.query.number;
  const set = await setDAO.getPublic(number);

  if (set) {
    res.json(set);
  } else {
    res.sendStatus(404);
  }
});

// Update metadata of set
router.put("/:id", authorizationCheck, async (req, res, next) => {
  const setId = req.params.id;
  const { title, description, category } = req.body;
  const set = await setDAO.getById(req.params.id);

  if (set) {
    if (set.userId === res.locals.user._id) {

        const setUpdated = await setDAO.updateSetById(
          setId,
          title,
          description,
          category
        );
      console.log(setUpdated)  
      if (setUpdated) {
        res.json(setUpdated);
      } else {
        res.status(401).json(e);
      }
    }
  } else {
    res.status(401).json(e);
  }
});
// Change public status of set
router.put("/public/:id/", authorizationCheck, async (req, res, next) => {
  const isPublic = req.body.isPublic;
  const setId = req.params.id;
  const userId = res.locals.user._id;

  const set = await setDAO.getById(req.params.id);
  if (set) {
    if (set.userId === res.locals.user._id) {
      const setPublic = await setDAO.makePublic(setId, userId, isPublic);
      if (setPublic) {
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    } else {
      res.sendStatus(401);
    }
  } else {
    res.sendStatus(401);
  }
});

// GET single set
router.get("/:id", authorizationCheck, async (req, res, next) => {
  const set = await setDAO.getById(req.params.id);
  if (!set) {
    res.sendStatus(404);
  } else if (
    set.isPublic === true ||
    set.userId === res.locals.user._id ||
    res.locals.user.roles.includes("admin")
  ) {
    res.json(set);
  } else if (set) {
    res.sendStatus(401);
  } else {
    res.sendStatus(404);
  }
});

// PUT single set
router.post("/start/:id", authorizationCheck, async (req, res, next) => {
  const set = await setDAO.getById(req.params.id);
  if (
    set.isPublic === true ||
    set.userId === res.locals.user._id ||
    res.locals.user.roles.includes("admin")
  ) {
    const setAttempts = set.setAttempts;
    const setAdded = setDAO.startById(req.params.id, setAttempts);
    if (setAdded) {
      const history = historyDAO.startSet(
        req.params.id,
        set.category,
        res.locals.user._id
      );
      return history;
    } else {
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(404);
  }
});

// Delete
router.delete("/:id", async (req, res, next) => {
  const setId = req.params.id;
  try {
    const set = await setDAO.getById(req.params.id);
    if (
      set.isPublic === true ||
      set.userId === res.locals.user._id ||
      res.locals.user.roles.includes("admin")
    ) {
      const success = await setDAO.deleteById(setId);
      res.sendStatus(success ? 200 : 400);
    }
  } catch (e) {
    res.status(500).send(e.message);
  }
});
module.exports = router;
