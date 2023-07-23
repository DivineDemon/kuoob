const fs = require("fs").promises;

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
      return res.status(response.status).json({
        success: false,
        message: "Error sending the message",
        errorData,
      });
    }

    const responseData = await response.json();
    return res.status(201).json({
      success: true,
      message: "Successfully Sent Message!",
      data: responseData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Please Try Again!",
      error: error.message,
    });
  }
};

module.exports = {
  sendMessage,
};
