'use strict';

var request = require('request'),
    _ = require('lodash'),
    url = require('url'),
    q = require('q');

module.exports = {
    getImages: getImages,
    getImagePage: getImagePage
};

function getImages(searchTerm, offset, maxCount) {
    var deferred = q.defer();
    if (!searchTerm) {
        deferred.reject(new Error('Search term is missing.'));
    }

    if (!isValidInt(offset)) {
        offset = 1;
    }

    if (!isValidInt(maxCount) ) {
        maxCount = 20;
    }

    function recursiveGetImages(term, page, ids) {
        var deferred = q.defer();
        getImagePage(term, page).then(function(result) {
            if (_.isEmpty(result.ids)) {
                return deferred.resolve({ids: [], page: result.page});
            }

            ids = ids.concat(result.ids.splice(0, maxCount - ids.length));

            if (ids.length < maxCount) {
                deferred.resolve(recursiveGetImages(term, page + 1, ids));
            }
            else {
                deferred.resolve({ids: ids, page: page});
            }
        }, function(err) {
            deferred.reject(err);
        });

        return deferred.promise;
    }

    var ids = [];
    recursiveGetImages(searchTerm, offset, ids).then(function(result) {
        deferred.resolve({ids: result.ids, page: result.page});
    }, function(err) {
        deferred.reject(err);
    });

    return deferred.promise;
}

function getImagePage(searchTerm, page) {
    var deferred = q.defer(),
        queryString;

    if (!searchTerm) {
        deferred.reject(new Error('Search term is missing.'));
    }

    if (!isValidInt(page)) {
        page = 1;
    }

    queryString = url.format({
            protocol: 'http',
            host: 'memecaptain.com/src_images',
            query: {
                q: searchTerm,
                page: page
            }
        });

    request
        .get({
            url: queryString,
            headers: {
                Accept: 'application/json'
            }
        }, function(err, response, body) {
            if (err) {
                deferred.reject(err);
            }
            else {
                var jsonBody = JSON.parse(body),
                    ids = _.map(jsonBody, function(item) {
                        return item.id_hash;
                    });
                deferred.resolve({ids: ids, page:page});
            }
        });

    return deferred.promise;
}

function isValidInt(number) {
    if (!number || _.isNaN(parseInt(number)) || parseInt(number) <= 0) {
        return false;
    }

    return true;
}
