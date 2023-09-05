const express = require("express");
const { getUserOrders } = require("../controllers/orders");

const router = express.Router();

router.get("/user", getUserOrders);

module.exports = router;
