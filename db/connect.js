const mongoose = require("mongoose");

const connectDB = (url) => {
  mongoose.set("strictQuery", false);
  return mongoose.connect(url);
};

module.exports = connectDB;

// const connectDB = (url) => {
//   return mongoose.connect(url, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true,
//   })
// }
