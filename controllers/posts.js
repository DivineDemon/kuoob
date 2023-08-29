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
  getTypePosts,
  getUserPosts,
  createRequest,
  getStatusPosts,
  getUserRequests,
  getCategoryPosts,
  getPostCategories,
};
