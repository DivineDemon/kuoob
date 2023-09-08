const express = require("express");
const { getUserOrders, getUserEarnings } = require("../controllers/orders");

const router = express.Router();

router.get("/user", getUserOrders);
router.get("/earnings", getUserEarnings);

module.exports = router;
