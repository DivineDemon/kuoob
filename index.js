const cors = require("cors");
const multer = require("multer");
const socketio = require("socket.io");
const dotenv = require("dotenv").config();

const http = require("http");
const express = require("express");
const { errorHandler } = require("./middleware/errorHandler");

// JSON BigInt Parsing Support for Prisma
BigInt.prototype.toJSON = function () { return this.toString() };

// App Initialization
const app = express();
const upload = multer();

// Socket IO Initialization
const server = http.createServer(app);
const io = socketio(server);

// Middleware
app.use(cors());
app.use(errorHandler);
app.use(express.json({ limit: "200mb", extended: true }));
app.use(express.urlencoded({ limit: "200mb", extended: true }));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/users", require("./routes/users"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/message", upload.any(), require("./routes/messages"));

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server Running on Port: http://localhost:${PORT}/`)
);
