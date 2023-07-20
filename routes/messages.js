const express = require("express");
const { sendMessage } = require("../controllers/messages");

const router = express.Router();

router.get("/", sendMessage);

module.exports = router;
