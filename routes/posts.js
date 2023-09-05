const express = require("express");
const {
  getPost,
  getPosts,
  createPost,
  getRequest,
  getRequests,
  filterPosts,
  getTypePosts,
  getUserPosts,
  createRequest,
  getStatusPosts,
  getUserRequests,
  getCategoryPosts,
  getPostCategories,
} = require("../controllers/posts");

const router = express.Router();

router.get("/all", getPosts);
router.get("/type", getTypePosts);
router.get("/user", getUserPosts);
router.get("/filter", filterPosts);
router.get("/status", getStatusPosts);
router.get("/search", getCategoryPosts);
router.get("/categories", getPostCategories);
router.route("/").get(getPost).post(createPost);

router.get("/request/all", getRequests);
router.get("/request/user", getUserRequests);
router.route("/request").get(getRequest).post(createRequest);

module.exports = router;
