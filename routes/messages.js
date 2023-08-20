const express = require("express");
const {
  sendMessage,
  getAllMessages,
  getTypeMessages,
  getUserMessages,
  getPostMessages,
  getMessage,
  getUserTypeMessages,
} = require("../controllers/messages");

const router = express.Router();

router.get("/all", getAllMessages);
router.get("/type", getTypeMessages);
router.get("/user", getUserMessages);
router.get("/post", getPostMessages);
router.get("/userType", getUserTypeMessages);
router.route("/").post(sendMessage).get(getMessage);

module.exports = router;
