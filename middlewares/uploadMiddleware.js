const multer = require("multer");
const path = require("path");

const multerConfig = multer.diskStorage({
  destination: path.join(__dirname, "../", "tmp"),
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadMiddleware = multer({
  storage: multerConfig,
});

module.exports = {
  uploadMiddleware,
};
