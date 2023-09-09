const extractURL = (url) => {
  if (typeof url === "object") {
    return url.images;
  }

  let imageURL = "";
  const parsedData = JSON.parse(url);

  if (Array.isArray(parsedData) && parsedData.length > 0) {
    imageURL = parsedData[0]["image:loc"];
    return imageURL;
  } else {
    imageURL = parsedData[0].images;
    return imageURL;
  }
};

const calculateRevenueAndTax = (data) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);

  const lastMonth = new Date(today);
  lastMonth.setMonth(today.getMonth() - 1);

  const result = [
    { period: "today", earning: 0, tax: 0, orders: 0 },
    { period: "yesterday", earning: 0, tax: 0, orders: 0 },
    { period: "lastWeek", earning: 0, tax: 0, orders: 0 },
    { period: "lastMonth", earning: 0, tax: 0, orders: 0 },
    { period: "older", earning: 0, tax: 0, orders: 0 },
  ];

  data.forEach((item) => {
    if (item) {
      const dateCreated = new Date(item.date_created);
      const earning = parseFloat(item.product_gross_revenue);
      const tax = parseFloat(item.tax_amount);

      if (dateCreated >= today) {
        result[0].earning += earning;
        result[0].tax += tax;
        result[0].orders++;
      } else if (dateCreated >= yesterday) {
        result[1].earning += earning;
        result[1].tax += tax;
        result[1].orders++;
      } else if (dateCreated >= lastWeek) {
        result[2].earning += earning;
        result[2].tax += tax;
        result[2].orders++;
      } else if (dateCreated >= lastMonth) {
        result[3].earning += earning;
        result[3].tax += tax;
        result[3].orders++;
      } else {
        result[4].earning += earning;
        result[4].tax += tax;
        result[4].orders++;
      }
    }
  });

  return result;
};

const areAllNull = (array) => {
  return array.every((value) => value === null);
}

module.exports = {
  extractURL,
  areAllNull,
  calculateRevenueAndTax,
};
