'use strict';

var url = require('url'),
    request = require('request'),
    _ = require('lodash');


module.exports = createMeme;

function createMeme(imageId, private, topText, bottomText, topConfig, bottomConfig, cb) {
    topConfig = _.merge({
        'top_left_x_pct': 0.05,
        'top_left_y_pct': 0,
        'width_pct': 0.9,
        'height_pct': 0.25
    }, _.pick(topConfig, 'top_left_x_pct', 'top_left_y_pct', 'width_pct', 'height_pct'));

    bottomConfig = _.merge({
        'top_left_x_pct': 0.05,
        'top_left_y_pct': 0,
        'width_pct': 0.9,
        'height_pct': 0.25
    }, _.pick(bottomConfig, 'top_left_x_pct', 'top_left_y_pct', 'width_pct', 'height_pct'));

    request.post({
        protocol: 'http',
        host: 'memecaptain.com/gend_images',
        src_image_id: imageId,
        private: private,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        captions_attributes: [
            _.merge({text: topText}, topConfig),
            _.merge({text: bottomText}, bottomConfig)
        ]
    }, function(err,httpResponse,body) {
        if (err) {
            throw new Error('Fail to create meme' + err);
        }

        var jsonBody = JSON.parse(body);
        if (httpResponse.statusCode === 200) {
            var poll_uri = jsonBody['Location'];

            // FIXME: crazy shit here
            async(10, function() {
                request.get(poll_uri, function(err, httpResponse, body) {
                    if (httpResponse.statusCode === 303) {
                        return cb(null, JSON.parse(body)['Location']);
                    }
                });
            });
        }
    });
}
