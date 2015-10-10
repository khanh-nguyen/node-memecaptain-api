# MemeCaptain API [![NPM version](https://img.shields.io/npm/v/node-memecaptain-api.svg?style=flat-square)](https://www.npmjs.com/package/node-meme-captain-api) [![NPM download count](https://img.shields.io/npm/dm/node-memecaptaion-api.svg?style=flat-square)](https://www.npmjs.com/package/node-memecaptain-api)

## Usage
```
var captainApi = require('node-memecaptain-api');

// get a page of image ids
captainApi.getImagePage('search term', offsetPage=1).then(function({ids: ids, page: offsetPage}) {
    // do your own business
}, function(err) {
    // handle error
});

// get an array of `maxCount` source image ids, offset from page `offsetPage`
captainApi.getImages('search term', maxCount=20, offsetPage=1)
          .then(function({ids: ids, page: offsetPage}) {
              // make use of the images
          }, function(err) {
              // handle error
          });

// create meme given image source
captainApi.createMeme('sourceImageId', 'top text', 'bottom text')
          .then(function(memeUrl) {
              // use generated meme
          }, function(err) {
              // handle error
          });

// create source image given image url
captainApi.createImage('url', 'name')
          .then(function({id: sourceId, name: name} {
              // ...
          }, function(err) {
              // ...
          }); 

captainApi.createImage(['url1', 'url2', ...], 'name')
          .function({id: sourceId, name: name}) {
              // ...
          }, function(err) {
              // ...
          });
```
