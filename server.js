require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const studentRoutes = require("./routes/student.routes");
const lessonRoutes = require("./routes/lesson.routes");
const sessionRoutes = require("./routes/session.routes");
const bookingRoutes = require("./routes/booking.routes");
const llmRoutes = require("./routes/llm.routes");

const app = express();

// middlewares
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// connect database
connectDB();

/*
|--------------------------------------------------------------------------
| API Request Logger Middleware
|--------------------------------------------------------------------------
*/

app.use((req, res, next) => {
  const time = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const statusCode = res.statusCode;
  console.log(`[${time}] ${method} ${url} - ${statusCode}`);

  next();
});

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/

app.use("/auth", authRoutes);
app.use("/students", studentRoutes);
app.use("/lessons", lessonRoutes);
app.use("/sessions", sessionRoutes);
app.use("/bookings", bookingRoutes);
app.use("/llm", llmRoutes);

/*
|--------------------------------------------------------------------------
| Root Route
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Mentora Backend API is running",
  });
});

/*
|--------------------------------------------------------------------------
| 404 Route Handler
|--------------------------------------------------------------------------
*/

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
