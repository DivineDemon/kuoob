const { PrismaClient } = require("@prisma/client");
const { sendResponse } = require("../utils/responseHandler");

const prisma = new PrismaClient();

const getMessage = async (req, res) => {
  try {
    const response = await prisma.wp_comments.findUnique({
      where: {
        comment_ID: parseInt(req.query.comment_id),
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

const getAllMessages = async (_, res) => {
  try {
    const response = await prisma.wp_comments.findMany();

    if (response.length === 0) {
      sendResponse(res, 404);
    } else {
      sendResponse(res, 200, response);
    }
  } catch (error) {
    sendResponse(res, 500);
  }
};

const getUserMessages = async (req, res) => {
  try {
    const response = await prisma.wp_comments.findMany({
      where: {
        user_id: parseInt(req.query.user_id),
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

const getTypeMessages = async (req, res) => {
  try {
    const response = await prisma.wp_comments.findMany({
      where: {
        comment_type: req.query.comment_type,
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

const getPostMessages = async (req, res) => {
  try {
    const response = await prisma.wp_comments.findMany({
      where: {
        comment_post_ID: parseInt(req.query.post_id),
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

const getUserTypeMessages = async (req, res) => {
  try {
    const response = await prisma.wp_comments.findMany({
      where: {
        user_id: parseInt(req.query.user_id),
        comment_type: req.query.comment_type,
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
  getMessage,
  getAllMessages,
  getUserMessages,
  getTypeMessages,
  getPostMessages,
  getUserTypeMessages,
};
