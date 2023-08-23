const express = require("express");
const {
  getUserByID,
  getUserByName,
  getUserByEmail,
} = require("../controllers/users");

const router = express.Router();

router.route("/").get(getUserByID);
router.get("/email", getUserByEmail);
router.get("/username", getUserByName);

module.exports = router;