const { PrismaClient } = require("@prisma/client");
const { sendResponse } = require("../utils/responseHandler");
const { calculateRevenueAndTax } = require("../utils/helpers");

const prisma = new PrismaClient();

const getUserOrders = async (req, res) => {
  try {
    const userOrders = await prisma.wp_wc_order_product_lookup.findMany({
      where: {
        customer_id: parseInt(req.query.user_id),
      },
      select: {
        order_id: true,
        product_id: true,
      },
    });

    const products = await Promise.all(
      userOrders.map(async (order) => {
        const finalProduct = await prisma.wp_posts.findFirst({
          where: {
            ID: parseInt(order.product_id),
          },
          select: {
            post_title: true,
          },
        });

        return finalProduct;
      })
    );

    const orders = await Promise.all(
      userOrders.map(async (order) => {
        const finalOrder = await prisma.wp_wc_order_stats.findFirst({
          where: {
            order_id: parseInt(order.order_id),
          },
          select: {
            status: true,
            total_sales: true,
            date_created: true,
          },
        });

        return finalOrder;
      })
    );

    const finalResponse = userOrders.map((post, index) => {
      return {
        post_title:
          products[index].post_title !== "" ? products[index].post_title : "",
        post_price:
          orders[index].total_sales !== ""
            ? parseInt(orders[index].total_sales)
            : 0,
        order_status:
          orders[index].status !== "" ? orders[index].status : "wc-on-hold",
        date_created:
          orders[index].date_created !== ""
            ? new Date(orders[index].date_created).toLocaleDateString()
            : "",
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

const getUserEarnings = async (req, res) => {
  try {
    let posts = await prisma.wp_posts.findMany({
      where: {
        post_author: parseInt(req.query.user_id),
        post_type: "product",
      },
      select: {
        ID: true,
      },
    });

    let orders = await Promise.all(
      posts.map(async (post) => {
        const orderDetails = await prisma.wp_wc_order_product_lookup.findFirst({
          where: {
            product_id: parseInt(post.ID),
          },
          select: {
            product_id: true,
            tax_amount: true,
            date_created: true,
            product_gross_revenue: true,
          },
        });

        return orderDetails;
      })
    );

    const finalData = calculateRevenueAndTax(orders);

    if (finalData.length === 0) {
      sendResponse(res, 404);
    } else {
      sendResponse(res, 200, finalData);
    }
  } catch (error) {
    sendResponse(res, 500, error);
  }
};

const receivedOrders = async (req, res) => {
  try {
    let posts = await prisma.wp_posts.findMany({
      where: {
        post_author: parseInt(req.query.user_id),
        post_type: "product",
      },
      select: {
        ID: true,
      },
    });

    let orders = await Promise.all(
      posts.map(async (post) => {
        const orderDetails = await prisma.wp_wc_order_product_lookup.findFirst({
          where: {
            product_id: parseInt(post.ID),
          },
          select: {
            order_id: true,
          },
        });

        return orderDetails;
      })
    );

    let orderStats = await Promise.all(
      orders.map(async (order) => {
        if (order !== null) {
          const orderDetails = await prisma.wp_wc_order_stats.findFirst({
            where: {
              order_id: parseInt(order.order_id),
            },
            select: {
              status: true,
              order_id: true,
              net_total: true,
              date_created: true,
            },
          });

          return orderDetails;
        }
      })
    );

    let finalStats = orderStats.map((stat) => {
      if (stat !== undefined) {
        return {
          status: stat.status,
          price: stat.net_total,
          order_id: parseInt(stat.order_id),
          date: new Date(stat.date_created).toLocaleDateString(),
        };
      }
    });

    finalStats = finalStats.filter((fs) => fs !== undefined);

    if (finalStats.length === 0) {
      sendResponse(res, 404);
    } else {
      sendResponse(res, 200, finalStats);
    }
  } catch (error) {
    sendResponse(res, 500, error);
  }
};

const placedOrders = async (req, res) => {
  /**
   * Order Details (wp_wc_order_stats)
   * - status (status)
   * - date (date_created)
   * - total (net_total)
   * - tax (tax_total)
   * - grand total (total_sales)
   * User Details (wp_users)
   * - username (user_nicename)
   * Product Details
   * - title (post_title)
   * - type (post_type)
   */
};

module.exports = {
  getUserOrders,
  receivedOrders,
  getUserEarnings,
};
