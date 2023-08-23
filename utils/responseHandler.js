const sendResponse = (res, statusCode, data) => {
  switch (statusCode) {
    case 200:
      return res.status(statusCode).json({
        success: true,
        message: "Retrieval Successful!",
        data,
      });
    case 201:
      return res.status(statusCode).json({
        success: true,
        message: "Insertion Successful!",
      });
    case 400:
      return res.status(statusCode).json({
        success: false,
        message: "Bad Request!",
      });
    case 401:
      return res.status(statusCode).json({
        success: false,
        message: "Please Login to Access Resources!",
      });
    case 403:
      return res.status(statusCode).json({
        success: false,
        message: "User Forbidden!",
      });
    case 404:
      return res.status(statusCode).json({
        success: false,
        message: "Data Not Found!",
      });
    case 500:
      return res.status(statusCode).json({
        success: false,
        message: "Internal Server Error!",
        error: data.message,
      });
    default:
      let success = false;
      if (data.status >= 200 && data.status <= 299) success = true;
      if (data.status >= 400 && data.status <= 499) success = false;
      if (data.status >= 500 && data.status <= 599) success = false;

      return res.status(data.status).json({
        success,
        message: data.statusText,
      });
  }
};

module.exports = {
  sendResponse,
};
