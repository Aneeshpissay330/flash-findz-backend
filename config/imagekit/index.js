const ImageKit = require('imagekit');

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

const uploadImage = async (file, folder) => {
  const uploadedImage = await imagekit.upload({
    file: file.buffer.toString('base64'),
    fileName: `${Date.now()}.png`,
    folder: folder
  });
  return uploadedImage;
};

module.exports = uploadImage;
