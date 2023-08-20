const express = require("express");
const {
  sendMessage,
  getAllMessages,
  getTypeMessages,
  getUserMessages,
  getPostMessages,
  getMessage,
} = require("../controllers/messages");

const router = express.Router();

router.route("/").post(sendMessage).get(getMessage);
router.get("/all", getAllMessages);
router.get("/type", getTypeMessages);
router.get("/user", getUserMessages);
router.get("/post", getPostMessages);

module.exports = router;
