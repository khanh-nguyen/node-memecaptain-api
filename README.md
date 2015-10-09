# MemeCaptain API

## Usage
```
var captainApi = require('node-memecaptain-api');

// get a page of image ids
var {ids: ids, page: offsetPage} = captainApi.getImagePage('search term', offsetPage=1);

// get an array of `maxCount` source image ids, offset from page `offsetPage`
var {ids: ids, page: offsetPage} = 
    captainApi.getImages('search term', maxCount=20, offsetPage=1);

// create meme given image source
var memeUrl = captainApi.createMeme('sourceImageId', 'top text', 'bottom text')

// create source image given image url
var {id: sourceId, name: name} = captainApi.createImage('url', 'name')
var {id: sourceId, name: name} = captainApi.createImage(['url1', 'url2', ...], 'name')
```
