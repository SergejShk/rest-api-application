const app = require("./app");
const { connectMongo } = require("./db/dbConnection");

const start = async () => {
  try {
    await connectMongo();
    console.log("Database connection successful");

    app.listen(3000, () => {
      console.log("Server running. Use our API on port: 3000");
    });
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

start();
