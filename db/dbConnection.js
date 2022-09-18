const mongoose = require("mongoose");

const url =
  "mongodb+srv://serhii-ssh:firstcluster@cluster0.qmv4cuu.mongodb.net/phonebook?retryWrites=true&w=majority";

const connectMongo = async () => {
  try {
    return await mongoose.connect(url, {
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
