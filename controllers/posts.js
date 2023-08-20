const { PrismaClient } = require("@prisma/client");
const { sendResponse } = require("../utils/responseHandler");

const prisma = new PrismaClient();

const getPost = async (req, res) => {
  try {
    const response = await prisma.wp_posts.findUnique({
      where: {
        ID: req.query.post_id,
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
        post_author: req.query.user_id,
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

module.exports = {
  getPost,
  getPosts,
  getTypePosts,
  getUserPosts,
  getStatusPosts,
};
