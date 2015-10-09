'use strict';

var createImage = require('../lib/create-image'),
    test = require('tape');

test('createMeme', function(t) {
    t.test('create an image from single source', function(t) {
        t.plan(2);

        createImage('https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png', 'google logo').
            then(function(result) {
                t.equal(result.id.length, 6, 'creates a source image with valid id.');
                t.equal(result.name, 'google logo', 'uses the given name for the image.');
            }, function(err) {
                t.fail('Fail to create image ' + err);
                t.fail('Cannot create image.');
            });
    });

    t.test('invalid arguments', function(t) {
        t.plan(1);

        createImage('not an url', 'foo').then(function(result) {
            t.fail('Resolve when there is invalid argument');
        }, function(err) {
            t.equal(/^urls must be an url or an array of urls.*/.test(err.message), true, 'Rejects if passed invalid url');
        })
    })
});
