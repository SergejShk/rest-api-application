const jimp = require("jimp");
const fs = require("fs/promises");

const updateAvatar = async (file, tmpDir) => {
  try {
    const img = await jimp.read(file.path);
    await img
      .autocrop()
      .cover(
        250,
        250,
        jimp.HORIZONTAL_ALIGN_CENTER || jimp.VERTICAL_ALIGN_MIDDLE
      )
      .writeAsync(file.path);
  } catch (error) {
    await fs.unlink(tmpDir);
  }
};

module.exports = {
  updateAvatar,
};
