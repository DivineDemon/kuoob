const fs = require("fs").promises;

const login = async (req, res) => {
  try {
    let jsonData = {};
    const { username, password } = req.body;

    const response = await fetch(
      `https://kuoob.com/wp-json/jwt-auth/v1/token?username=${username}&password=${password}`,
      { method: "POST" }
    );

    const data = await response.text();
    let check = data.includes("code") ? true : false;

    if (check) {
      jsonData = JSON.parse(
        "{" + data.split("{")[1] + "{" + data.split("{")[2]
      );
      return res.status(jsonData.data.status).json({
        success: false,
        message: jsonData.message,
        error: jsonData.code,
      });
    } else {
      jsonData = "{" + data.split("{")[1];
      await fs.writeFile("./token.txt", jsonData);
    }

    return res.status(200).json({
      success: true,
      message: "Successfully Logged In!",
      user: JSON.parse(jsonData),
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
  login,
};
