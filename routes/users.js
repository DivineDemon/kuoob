const express = require("express");
const {
  getUsers,
  getUserByID,
  getUserByName,
  getUserByEmail,
} = require("../controllers/users");

const router = express.Router();

router.get("/all", getUsers);
router.route("/").get(getUserByID);
router.get("/email", getUserByEmail);
router.get("/username", getUserByName);

module.exports = router;