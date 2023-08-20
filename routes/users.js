const express = require("express");
const { getUserByID, getUserByEmail } = require("../controllers/users");
const { getSignature } = require("prisma");

const router = express.Router();

router.route("/").get(getUserByID);
router.get("/email", getUserByEmail);
router.get("/username", getSignature);