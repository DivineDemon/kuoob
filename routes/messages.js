const express = require("express");
const { sendMessage } = require("../controllers/messages");

const router = express.Router();

router.post("/", sendMessage);

module.exports = router;
