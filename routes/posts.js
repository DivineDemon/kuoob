const express = require("express");
const {
  getPost,
  getPosts,
  getTypePosts,
  getUserPosts,
  getStatusPosts,
  getUserRequests,
} = require("../controllers/posts");

const router = express.Router();

router.get("/all", getPosts);
router.route("/").get(getPost);
router.get("/type", getTypePosts);
router.get("/user", getUserPosts);
router.get("/status", getStatusPosts);
router.get("/request", getUserRequests);

module.exports = router;
