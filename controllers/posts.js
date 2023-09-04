const { PrismaClient } = require("@prisma/client");
const { sendResponse } = require("../utils/responseHandler");
const { extractURL } = require("../utils/helpers");

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

    if (response.length === 0 || response === null) {
      sendResponse(res, 404);
    } else {
      sendResponse(res, 200, response);
    }
  } catch (error) {
    sendResponse(res, 500, error);
  }
};

const getPosts = async (_, res) => {
  try {
    const posts = await prisma.wp_posts.findMany({
      where: {
        post_type: "hp_listing",
      },
    });

    let post_images = await Promise.all(
      posts.map(async (post) => {
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

    const post_prices = await Promise.all(
      posts.map(async (post) => {
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

    const finalResponse = posts.map((post, index) => {
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

const getStatusPosts = async (req, res) => {
  try {
    const response = await prisma.wp_posts.findMany({
      where: {
        post_status: req.query.status,
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

const getTypePosts = async (req, res) => {
  try {
    const response = await prisma.wp_posts.findMany({
      where: {
        post_type: req.query.type,
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
  const newPost = [];
  const { title, description, excerpt, rate, image } = req.body;

  try {
    const newPostData = await prisma.wp_posts.create({
      data: {
        post_author: parseInt(req.query.user_id),
        post_date: new Date().toISOString(),
        post_content: description,
        post_title: title,
        post_excerpt: excerpt,
        post_type: "hp_listing",
        post_modified: new Date().toISOString(),
      },
    });

    newPost.push(newPostData);

    const newPostRate = await prisma.wp_wc_product_meta_lookup.create({
      data: {
        product_id: parseInt(newPostData.ID),
        virtual: true,
        downloadable: false,
        min_price: rate,
        max_price: rate,
        onsale: false,
      },
    });

    newPost.push(newPostRate);

    const newPostImage = await prisma.wp_aioseo_posts.create({
      data: {
        post_id: parseInt(newPostData.ID),
        images: image,
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
      },
    });

    newPost.push(newPostImage);

    if (newPost.length < 3) {
      sendResponse(res, 400);
    } else {
      sendResponse(res, 200, newPost);
    }
  } catch (error) {
    sendResponse(res, 500, error);
  }
};

const getPostCategories = async (_, res) => {
  try {
    let response = await prisma.wp_posts.findMany({
      where: {
        post_type: "hp_listing",
        NOT: {
          post_excerpt: "",
        },
        post_excerpt: {
          contains: "Category",
        },
      },
      select: {
        post_excerpt: true,
      },
    });

    if (response.length === 0) {
      sendResponse(res, 404);
    } else {
      response = response.map((category) => {
        return category.post_excerpt.split(/; T|; V|y: /)[1];
      });
      response = [...new Set(response)];
      sendResponse(res, 200, response);
    }
  } catch (error) {
    sendResponse(res, 500, error);
  }
};

const getCategoryPosts = async (req, res) => {
  try {
    let response = await prisma.wp_posts.findMany({
      where: {
        post_type: "hp_listing",
        post_excerpt: {
          contains: req.query.search_word,
        },
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

const filterPosts = async (req, res) => {
  let posts = null;
  const { category, price } = req.body;

  try {
    if (category) {
      posts = await prisma.wp_posts.findMany({
        where: {
          post_type: "hp_listing",
          post_excerpt: {
            contains: req.query.search_word,
          },
        },
      });

      posts = await Promise.all(
        posts.map(async (post) => {
          const response = await prisma.wp_wc_product_meta_lookup.findFirst({
            where: {
              OR: [
                { min_price: price },
                { max_price: price },
                { min_price: { lte: price }, max_price: { gte: price } },
              ],
            },
          });

          return response;
        })
      );
    }
  } catch (error) {}
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

const getRequests = async (_, res) => {
  try {
    const response = await prisma.wp_posts.findMany({
      where: {
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
  const newRequest = [];
  const { title, description, excerpt, rate, image } = req.body;

  try {
    const newRequestData = await prisma.wp_posts.create({
      data: {
        post_author: parseInt(req.query.user_id),
        post_date: new Date().toISOString(),
        post_content: description,
        post_title: title,
        post_excerpt: excerpt,
        post_type: "hp_request",
        post_modified: new Date().toISOString(),
      },
    });

    newRequest.push(newRequestData);

    const newRequestRate = await prisma.wp_wc_product_meta_lookup.create({
      data: {
        product_id: parseInt(newRequestData.ID),
        virtual: true,
        downloadable: false,
        min_price: rate,
        max_price: rate,
        onsale: false,
      },
    });

    newRequest.push(newRequestRate);

    const newRequestImage = await prisma.wp_aioseo_posts.create({
      data: {
        post_id: parseInt(newRequestData.ID),
        images: image,
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
      },
    });

    newRequest.push(newRequestImage);

    if (newRequest.length < 3) {
      sendResponse(res, 400);
    } else {
      sendResponse(res, 200, newRequest);
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
  getRequests,
  getTypePosts,
  getUserPosts,
  createRequest,
  getStatusPosts,
  getUserRequests,
  getCategoryPosts,
  getPostCategories,
};
