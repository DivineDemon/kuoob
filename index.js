const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const { errorHandler } = require("./middleware/errorHandler");

// App Initialization
const app = express();

// Middleware
app.use(cors());
app.use(errorHandler);
app.use(express.json({ limit: "200mb", extended: true }));
app.use(express.urlencoded({ limit: "200mb", extended: true }));

// Routes
app.use("/api/message", require("./routes/messages"));

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server Running on Port: http://localhost:${PORT}/`)
);
