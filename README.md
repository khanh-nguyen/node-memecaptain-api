# MemeCaptain API

## Usage
```
var captainApi = require('node-memecaptain-api');

// get an array of `maxCount` source image ids, offset from page `offsetPage`
var ids = captainApi.getSourceImageIds('search term', maxCount=100, offsetPage=1);

// create meme given image source
var memeUrl = captainApi.createMeme('sourceImageId', 'top text', 'bottom text', alignTop=center, alignBottom=center)

// create source image given image url
var sourceId = captainApi.createImage(name, private=false, url1, url2, ...)
```
