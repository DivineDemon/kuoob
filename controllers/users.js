const { PrismaClient } = require("@prisma/client");
const { sendResponse } = require("../utils/responseHandler");

const prisma = new PrismaClient();

const getUsers = async (req, res) => {
  try {
    const response = await prisma.wp_users.findMany();

    if (response.length === 0) {
      sendResponse(res, 404);
    } else {
      sendResponse(res, 200, response);
    }
  } catch (error) {
    sendResponse(res, 500, error);
  }
};

const getUserByID = async (req, res) => {
  try {
    const response = await prisma.wp_users.findUnique({
      where: {
        ID: parseInt(req.query.user_id),
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

const getUserByEmail = async (req, res) => {
  try {
    const response = await prisma.wp_users.findUnique({
      where: {
        user_email: parseInt(req.query.user_id),
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

const getUserByName = async (req, res) => {
  try {
    const response = await prisma.wp_users.findUnique({
      where: {
        user_nicename: req.query.username,
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
  getUsers,
  getUserByID,
  getUserByName,
  getUserByEmail,
};
