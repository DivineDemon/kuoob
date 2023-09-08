const express = require("express");
const {
  getUserOrders,
  receivedOrders,
  getUserEarnings,
} = require("../controllers/orders");

const router = express.Router();

router.get("/user", getUserOrders);
router.get("/received", receivedOrders);
router.get("/earnings", getUserEarnings);

module.exports = router;
