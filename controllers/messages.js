const fs = require("fs").promises;
const { sendResponse } = require("../utils/responseHandler");

const sendMessage = async (req, res) => {
  let userData = await fs.readFile("../kuoob/token.txt", "utf-8");
  userData = JSON.parse(userData);

  const formData = new FormData();
  for (const key in req.body) {
    formData.append(key, req.body[key]);
  }

  try {
    const response = await fetch(
      "https://kuoob.com/wp-json/hivepress/v1/messages/",
      {
        method: "POST",
        body: formData,
        headers: {
          authorization: `Bearer ${userData.token}`,
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      sendResponse(res, response.status, errorData);
    } else {
      const responseData = await response.json();
      sendResponse(res, 201, responseData);
    }
  } catch (error) {
    sendResponse(res, 500);
  }
};

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
    sendResponse(res, 500);
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

module.exports = {
  getMessage,
  sendMessage,
  getAllMessages,
  getUserMessages,
  getTypeMessages,
  getPostMessages,
};
