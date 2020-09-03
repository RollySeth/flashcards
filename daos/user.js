const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const salt = 10;
const jwt = require("jsonwebtoken");


module.exports = {};

module.exports.create = async (email, password, roles) => {
  const hashed = await bcrypt.hash(password, salt);
  try {
    const newUser = await User.create({
      email: email,
      password: hashed,
      roles: roles,
    });
    return newUser;
  } catch (e) {
    throw e;
  }
};

module.exports.getUser = async (email) => {
  try {
    const user = await User.findOne({ email: email });
    return user;
  } catch (e) {
    throw e;
  }
};

module.exports.getUserById = async (id) => {
  try {
    const user = await User.findOne(
      { _id: id },
      { _id: 1, email: 1, roles: 1 }
    );
    return user;
  } catch (e) {
    throw e;
  }
};
module.exports.getUserExceptPassword = async (email) => {
  try {
    const user = await User.findOne({ email: email }, { _id: 1, roles: 1 });
    return user;
  } catch (e) {
    throw e;
  }
};
module.exports.adminCreate = async (email) => {
  try {
    const admin = User.updateOne(
      { email: email },
      { $push: { roles: "admin" } }
    );
    return admin;
  } catch (e) {
    throw e;
  }
};

module.exports.changePassword = async (email, password) => {
  try {
    const hashed = await bcrypt.hash(password, salt);
    const updatedUser = User.updateOne({ email: email }, { password: hashed });
    return updatedUser;
  } catch (e) {
    throw e;
  }
};
class BadDataError extends Error {}
module.exports.BadDataError = BadDataError;
