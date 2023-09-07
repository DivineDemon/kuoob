const express = require("express");
const {
  getUsers,
  likePost,
  unlikePost,
  updateUser,
  getUserByID,
  getUserByName,
  getUserByEmail,
  likedPosts,
} = require("../controllers/users");

const router = express.Router();

router.get("/all", getUsers);
router.delete("/unlike", unlikePost);
router.get("/email", getUserByEmail);
router.get("/username", getUserByName);
router.route("/like").get(likedPosts).post(likePost);
router.route("/").get(getUserByID).patch(updateUser);

module.exports = router;