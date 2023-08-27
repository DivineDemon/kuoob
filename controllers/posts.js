const { PrismaClient } = require("@prisma/client");
const { sendResponse } = require("../utils/responseHandler");

const prisma = new PrismaClient();

/**
 * Post (Listing) Management
 * GET - getPost
 * GET - getPosts
 * GET - getStatusPosts
 * GET - getTypePosts
 * GET - getUserPosts
 * POST - createPost
 */

const getPost = async (req, res) => {
  try {
    const response = await prisma.wp_posts.findUnique({
      where: {
        ID: req.query.post_id,
        post_type: "hp_listing",
      },
    });

    if (response.length === 0) {
      sendResponse(res, 404);
    } else {
      sendResponse(res, 200, response);
    }
  } catch (error) {
    sendResponse(res, 500);
  }
};

const getPosts = async (_, res) => {
  try {
    const response = await prisma.wp_posts.findMany();

    if (response.length === 0) {
      sendResponse(res, 404);
    } else {
      sendResponse(res, 200, response);
    }
  } catch (error) {
    sendResponse(res, 500);
  }
};

const getStatusPosts = async (req, res) => {
  try {
    const response = await prisma.wp_posts.findMany({
      where: {
        post_status: req.query.status,
      },
    });

    if (response.length === 0) {
      sendResponse(res, 404);
    } else {
      sendResponse(res, 200, response);
    }
  } catch (error) {
    sendResponse(res, 500);
  }
};

const getTypePosts = async (req, res) => {
  try {
    const response = await prisma.wp_posts.findMany({
      where: {
        post_type: req.query.type,
      },
    });

    if (response.length === 0) {
      sendResponse(res, 404);
    } else {
      sendResponse(res, 200, response);
    }
  } catch (error) {
    sendResponse(res, 500);
  }
};

const getUserPosts = async (req, res) => {
  try {
    const response = await prisma.wp_posts.findMany({
      where: {
        post_author: parseInt(req.query.user_id),
        post_type: "hp_listing",
      },
    });

    if (response.length === 0) {
      sendResponse(res, 404);
    } else {
      sendResponse(res, 200, response);
    }
  } catch (error) {
    sendResponse(res, 500, error);
  }
};

const createPost = async (req, res) => {
  const { title, description, excerpt } = req.body;

  try {
    const response = await prisma.wp_posts.create({
      post_author: req.query.user_id,
      post_date: new Date().toISOString(),
      post_content: description,
      post_title: title,
      post_excerpt: excerpt,
      post_type: "hp_listing",
    });

    if (response.length === 0) {
      sendResponse(res, 404);
    } else {
      sendResponse(res, 200, response);
    }
  } catch (error) {
    sendResponse(res, 500, error);
  }
};

/**
 * User Requests Management
 * GET - getRequest
 * GET - getUserRequests
 * POST - createRequests
 */

const getRequest = async (req, res) => {
  try {
    const response = await prisma.wp_posts.findUnique({
      where: {
        ID: req.query.post_id,
        post_type: "hp_request",
      },
    });

    if (response.length === 0) {
      sendResponse(res, 404);
    } else {
      sendResponse(res, 200, response);
    }
  } catch (error) {
    sendResponse(res, 500);
  }
};

const getUserRequests = async (req, res) => {
  try {
    const response = await prisma.wp_posts.findMany({
      where: {
        post_author: parseInt(req.query.user_id),
        post_type: "hp_request",
      },
    });

    if (response.length === 0) {
      sendResponse(res, 404);
    } else {
      sendResponse(res, 200, response);
    }
  } catch (error) {
    sendResponse(res, 500, error);
  }
};

const createRequest = async (req, res) => {
  const { title, description, excerpt } = req.body;

  try {
    const response = await prisma.wp_posts.create({
      post_author: req.query.user_id,
      post_date: new Date().toISOString(),
      post_content: description,
      post_title: title,
      post_excerpt: excerpt,
      post_type: "hp_request",
    });

    if (response.length === 0) {
      sendResponse(res, 404);
    } else {
      sendResponse(res, 200, response);
    }
  } catch (error) {
    sendResponse(res, 500, error);
  }
};

module.exports = {
  getPost,
  getPosts,
  getRequest,
  createPost,
  getTypePosts,
  getUserPosts,
  createRequest,
  getStatusPosts,
  getUserRequests,
};
