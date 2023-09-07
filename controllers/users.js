const bcrypt = require("bcryptjs");
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

const updateUser = async (req, res) => {
  try {
    let encryptedPassword = null;
    if (req.body.user_pass) {
      encryptedPassword = bcrypt.hashSync(
        req.body.user_pass,
        10,
        (err, hash) => {
          if (!err) {
            return hash;
          } else {
            res.status(400).json({
              status: false,
              message: "Password Encryption Failed!",
              err,
            });
          }
        }
      );

      req.body.user_pass = encryptedPassword;
    }

    const response = await prisma.wp_users.update({
      where: {
        ID: parseInt(req.query.user_id),
      },
      data: req.body,
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

const likePost = async (req, res) => {
  try {
    const response = await prisma.favourites.create({
      data: {
        user_id: parseInt(req.query.user_id),
        post_id: parseInt(req.query.post_id),
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

const unlikePost = async (req, res) => {
  try {
    const response = await prisma.favourites.deleteMany({
      where: {
        user_id: parseInt(req.query.user_id),
        post_id: parseInt(req.query.post_id),
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

const likedPosts = async (req, res) => {
  try {
    let liked = await prisma.favourites.findMany({
      where: {
        user_id: parseInt(req.query.user_id),
      },
      select: {
        post_id: true,
      },
    });

    let finalPosts = await Promise.all(
      liked.map(async (post) => {
        const response = await prisma.wp_posts.findFirst({
          where: {
            ID: post.post_id,
          },
        });

        return response;
      })
    );

    let post_images = await Promise.all(
      finalPosts.map(async (post) => {
        const image = await prisma.wp_aioseo_posts.findMany({
          where: {
            post_id: post.ID,
          },
          select: {
            images: true,
          },
        });
        return image;
      })
    );

    let post_prices = await Promise.all(
      finalPosts.map(async (post) => {
        const price = await prisma.wp_wc_product_meta_lookup.findMany({
          where: {
            product_id: post.ID,
          },
          select: {
            min_price: true,
            max_price: true,
          },
        });

        return price;
      })
    );

    post_images = post_images.map((post) => {
      if (post.length !== 0) {
        if (
          post[0] !== undefined &&
          post[0].images !== null &&
          post[0].images !== undefined
        ) {
          let url = post[0].images;
          if (url.includes("[{")) {
            return extractURL(post[0].images);
          } else {
            return url;
          }
        }
      }
    });

    const finalResponse = finalPosts.map((post, index) => {
      return {
        post_image: post_images[index] !== undefined ? post_images[index] : "",
        post_rating:
          post_prices[index].average_rating === undefined
            ? 0.0
            : post_prices[index].rating_count,
        post_title: post.post_title,
        post_price: post_prices[index],
      };
    });

    if (finalResponse.length === 0) {
      sendResponse(res, 404);
    } else {
      sendResponse(res, 200, finalResponse);
    }
  } catch (error) {
    sendResponse(res, 500, error);
  }
};

module.exports = {
  getUsers,
  likePost,
  likedPosts,
  unlikePost,
  updateUser,
  getUserByID,
  getUserByName,
  getUserByEmail,
};
