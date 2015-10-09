'use strict';

var url = require('url'),
    _ = require('lodash'),
    validator = require('validator'),
    q = require('q'),
    request = require('request');

module.exports = createImage;

function createImage(urls, name) {
    var urlString = parseUrls(urls),
        deferred = q.defer(),
        queryString;

    if (_.isEmpty(name) || !_.isString(name)) {
        name = 'created by node-memcaptain-api';
    }

    if (_.isEmpty(urlString)) {
        deferred.reject(new Error('urls must be an url or an array of urls. Given ' + urls));
        return deferred.promise;
    }


    queryString = url.format({
        protocol: 'http',
        host: 'memecaptain.com/src_images'
    });

    request
        .post({
            url: queryString,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: urlString,
                name: name,
                private: false
            })
        }, function(err, response, body) {
            if (err) {
                return deferred.reject(err);
            }

            var jsonBody = JSON.parse(body);
            if (jsonBody.error) {
                return deferred.reject(new Error(jsonBody.error));
            }

            deferred.resolve({id: jsonBody.id, name: name});
        });

    return deferred.promise;
}

function parseUrls(urls) {
    if (_.isArray(urls)) {
        return _.map(urls, function(str) {
            if (validator.isURL(str)) {
                return str;
            }
        }).join('|');
    }

    if (_.isString(urls) && validator.isURL(urls)) {
        return urls;
    }

    return '';
}
