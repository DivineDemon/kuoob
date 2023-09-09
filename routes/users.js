const express = require("express");
const {
  isLiked,
  getUsers,
  likePost,
  likedPosts,
  unlikePost,
  deleteUser,
  updateUser,
  getUserByID,
  getUserByName,
  getUserByEmail,
} = require("../controllers/users");

const router = express.Router();

router.get("/all", getUsers);
router.get("/check", isLiked);
router.delete("/unlike", unlikePost);
router.get("/email", getUserByEmail);
router.get("/username", getUserByName);
router.patch("/deactivate", deleteUser);
router.route("/like").get(likedPosts).post(likePost);
router.route("/").get(getUserByID).patch(updateUser);

module.exports = router;