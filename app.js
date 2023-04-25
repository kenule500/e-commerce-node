require("dotenv").config();
require("express-async-errors");

// express
const express = require("express");
const app = express();

//rest of the packages
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

// Security packages
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");

//Database
const connectDB = require("./db/connect");

// routers
const authRouter = require("./routes/authRoute");
const userRouter = require("./routes/userRoute");
const productRouter = require("./routes/productRoute");
const reviewRouter = require("./routes/reviewRoute");
const orderRouter = require("./routes/orderRoute");

// Security packages
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

// database
const notFoundMiddleWare = require("./middleware/not-found");
const errorHandlerMiddleWare = require("./middleware/error-handler");

app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(cors());

///fileUploads = this uploads default image from the public folder
app.use(express.static("./public"));
app.use(fileUpload());

app.get("/", (req, res) => {
  res.send("e-commerce api");
});

app.get("/api/v1/", (req, res) => {
  console.log(req.signedCookies);
  res.send("e-commerce api");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);

app.use(notFoundMiddleWare);
app.use(errorHandlerMiddleWare);

const port = process.env.PORT | 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Server is listening on port ${port}....`));
  } catch (error) {
    console.log(error);
  }
};

start();
