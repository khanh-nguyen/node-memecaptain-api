'use strict';

var captainApi = require('..'),
    test = require('tape'),
    _ = require('lodash');

test('getImagePage', function(t) {
    t.test('get a page of images', function(t) {
        t.plan(1);

        captainApi.getImagePage('cat', 2).then(function() {
            t.pass('API for get image page works.');
        }, function(err) {
            t.fail('Fail to get images ' + err);
        });
    });

    t.test('search with no result', function(t) {
        t.plan(1);

        captainApi.getImagePage('suck', 2).then(function(result) {
            t.deepEqual(result.ids, [], 'returns an empty array.');
        }, function(err) {
            t.fail('Fail to get images ' + err);
        });
    });

    t.test('invalid argument', function(t) {
        t.plan(2);

        captainApi.getImagePage('cat', 'abc').then(function(result) {
            t.equal(_.isEmpty(result.ids), false, 'successfully searches for images.');
            t.equal(result.page, 1, 'sets page=1.');
        }, function(err) {
            t.fail('Fail to get images ' + err);
            t.fail('Fail to search when page is not a number.');
        });
    });
});

test('getImages', function(t) {
    t.test('get exact number of images', function(t) {
        t.plan(1);

        captainApi.getImages('cat', 1, 35).then(function(result) {
            t.equal(result.ids.length, 35, 'Get exact 35 images.');
        }, function(err) {
            t.fail('getImages was rejected ' + err);
        });
    });

    t.test('get big number of images', function(t) {
        t.plan(1);

        captainApi.getImages('suck', 1, 1000).then(function(result) {
            // NOTE: assuming there's no more than 4 pages of result returned.
            // at the time this test was written, there was only 1 page of result for `suck`.
            // Hence, we will stop after requesting page 2.
            t.equal(result.page < 3, true, 'resolve when no new data is retrieved.');
        }, function(err) {
            t.fail('getImages was rejected ' + err);
        });
    });
});

