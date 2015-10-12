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
    }).on('error', function(err) {
        deferred.reject(err);
    }).on('response', function(response) {
        if (response.statusCode === 202) {
            // HACK: despite the doc says that we should get 303 when the meme is ready
            // and although I do see 303 when running curl from command line
            // request to http://memecaptain.com/pending_gend_images/imageID always return 200
            // To work around, I poll http://memecaptain.com/gend_images/imageID until getting 200
            deferred.resolve(poll(response.headers.location.replace('pending_gend_images', 'gend_images'), 1));
        }
        else if (response.statusCode === 303) {
            deferred.resolve(response.headers.location);
        }
        else if (response.statusCode === 404) {
            deferred.reject(new Error('Source image does not exist.'));
        }
        else {
            deferred.reject(new Error('Request to create meme received a response ' + response.statusCode));
        }
    });

    return deferred.promise;
}

function poll(target, count) {
    if (count > 10) {
        return new Error('Takes too long for polling ' + target);
    }

    var deferred = q.defer();
    request
        .get(target)
        .on('response', function(response) {
            if (response.statusCode === 200) {
                deferred.resolve(target);
            }
            else if (response.statusCode === 404) {
                setTimeout(function() {
                    deferred.resolve(poll(target, count + 1));
                }, 500);
            }
            else {
                deferred.reject(new Error('Fail to poll: ' + target));
            }
        })
        .on('error', function(err) {
            deferred.reject(err);
        });

    return deferred.promise;
}
