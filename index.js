'use strict';

var createImage = require('./lib/create-image'),
    createMeme = require('./lib/create-meme'),
    getImagePage = require('./lib/get-images').getImagePage,
    getImages = require('./lib/get-images').getImages;

module.exports = {
    getImages: getImages,
    getImagePage: getImagePage,
    createImage: createImage,
    createMeme: createMeme
};
