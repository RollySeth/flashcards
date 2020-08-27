const { Router } = require("express");
const router = Router();
const setDAO = require("../daos/set");
const secret = "shhhhhh do not tell anyone this secret.";
const jwt = require("jsonwebtoken");

// Dummy auth check
const authorizationCheck = async (req, res, next) => {
  //    let header = req.headers.authorization;
  //    if (!header) {
  //        res.sendStatus(401);
  //    } else {
  //        const token = header.split(" ")[1];
  //        const userCheck = jwt.verify(token, secret, (e, tokenNew) => {
  //            if (e) {
  //               res.sendStatus(401);
  //            } else {
  //                req.user = tokenNew;
  //                next();
  //            }
  //        });
  //    }
  return;
};

router.use(authorizationCheck);

const adminCheck = async (req, res, next) => {
  if (req.user.roles.includes("admin")) {
    next();
  } else {
    res.sendStatus(403);
  }
};

router.post("/", async (req, res, next) => {
  const { title, description, category, userId } = req.body;
  const set = await setDAO.create(title, description, category, userId);
  if (set) {
    res.json(set);
  } else {
    res.sendStatus(401);
  }
});

router.put("/:id", adminCheck, async (req, res, next) => {
  const setId = req.params.id;
  const { title, description, category } = req.body;
  const set = await setDAO.updateSetById(setId, title, description, category);
  if (set) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

// GET single set
router.get("/:id", async (req, res, next) => {
  const set = await setDAO.getById(req.params.id);
  if (set) {
    res.json(set);
  } else {
    res.sendStatus(404);
  }
});

// Delete
router.delete("/:id", async (req, res, next) => {
  const setId = req.params.id;
  try {
    const success = await setDAO.deleteById(setId);
    res.sendStatus(success ? 200 : 400);
  } catch (e) {
    res.status(500).send(e.message);
  }
});
