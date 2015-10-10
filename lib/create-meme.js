'use strict';

var request = require('request'),
    q = require('q');

module.exports = createMeme;

// TODO: support more fine-grained options
function createMeme(imageId, topText, bottomText) {
    var deferred = q.defer(),
        payload = JSON.stringify({
            src_image_id: imageId,
            private: false,
            captions_attributes: [
                {
                    text: topText,
                    top_left_x_pct: 0.05,
                    top_left_y_pct: 0,
                    width_pct: 0.9,
                    height_pct: 0.25
                },
                {
                    text: bottomText,
                    top_left_x_pct: 0.05,
                    top_left_y_pct: 0.75,
                    width_pct: 0.9,
                    height_pct: 0.25
                }
            ]
        });

    request.post({
        url: 'http://memecaptain.com/gend_images',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: payload
    }, function(err, httpResponse, body) {
        if (err) {
            return deferred.reject(err);
        }

        var jsonBody = JSON.parse(body);
        if (jsonBody.error) {
            return deferred.reject(new Error(jsonBody.error));
        }

        // FIXME: memeCaptain returns a pending url until. We might need to poll until the meme is ready
        deferred.resolve(jsonBody['status_url'].replace('pending_gend_images', 'gend_images'));
    });

    return deferred.promise;
}
