const mongoose = require("mongoose");
require("dotenv").config();

const connectMongo = async () => {
  try {
    return await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  connectMongo,
};
