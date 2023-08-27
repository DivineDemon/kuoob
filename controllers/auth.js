const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const fs = require("fs").promises;
const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET;

const register = async (req, res) => {
  try {
    const { username, email, password, user_status, display_name } = req.body;
    const encryptedPassword = bcrypt.hashSync(password, 10, (err, hash) => {
      if (!err) {
        return hash;
      } else {
        res.status(400).json({
          status: false,
          message: "Password Encryption Failed!",
          err,
        });
      }
    });

    const response = await prisma.wp_users.create({
      data: {
        user_login: username,
        user_pass: encryptedPassword,
        user_nicename: username,
        user_email: email,
        user_registered: new Date().toISOString(),
        user_status,
        display_name,
      },
    });

    res.status(200).json({
      status: true,
      message: "Registered User Successfully!",
      user: response.ID,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Please Try Again!",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.wp_users.findUnique({
      where: {
        user_email: email,
      },
    });

    if (bcrypt.compareSync(password, user.user_pass)) {
      // Generate JWT Token
      const userToken = jwt.sign(
        {
          id: user.ID,
          email: user.email,
        },
        SECRET,
        {
          expiresIn: "30d",
        }
      );
      // Send User Data
      res.status(200).json({
        success: true,
        message: "User Logged In!",
        user,
        token: userToken,
      });
    } else {
      res.status(401).json({
        status: false,
        message: "Username or Password Incorrect!",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Please Try Again!",
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
};
