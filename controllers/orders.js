const { PrismaClient } = require("@prisma/client");
const { extractURL } = require("../utils/helpers");
const { sendResponse } = require("../utils/responseHandler");

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

module.exports = {
  getUserOrders,
};
