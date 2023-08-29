const express = require("express");
const {
  getPost,
  getPosts,
  createPost,
  getTypePosts,
  getUserPosts,
  getStatusPosts,
  getUserRequests,
  getCategoryPosts,
  getPostCategories,
} = require("../controllers/posts");

const router = express.Router();

router.get("/all", getPosts);
router.get("/type", getTypePosts);
router.get("/user", getUserPosts);
router.get("/status", getStatusPosts);
router.get("/request", getUserRequests);
router.get("/search", getCategoryPosts);
router.get("/categories", getPostCategories);
router.route("/").get(getPost).post(createPost);

module.exports = router;
