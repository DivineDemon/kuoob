const express = require("express");
const {
  getAllMessages,
  getTypeMessages,
  getUserMessages,
  getPostMessages,
  getMessage,
  getUserTypeMessages,
} = require("../controllers/messages");

const router = express.Router();

router.route("/").get(getMessage);
router.get("/all", getAllMessages);
router.get("/type", getTypeMessages);
router.get("/user", getUserMessages);
router.get("/post", getPostMessages);
router.get("/userType", getUserTypeMessages);

module.exports = router;
