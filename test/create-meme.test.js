'use strict';

var createMeme = require('../lib/create-meme'),
    test = require('tape');

test('createMeme', function(t) {
    t.test('create an image from single source', function(t) {
        t.plan(1);

        createMeme('rQ2j6g', 'test meme', 'generator').
            then(function(link) {
                t.equal(/^http:\/\/memecaptain\.com\/pending_gend_images\/.{6}/.test(link), true, 'generates image.');
            }, function(err) {
                t.fail('Fail to create image ' + err);
            });
    });

    t.test('not existing image', function(t) {
        t.plan(1);

        createMeme('notExistingId', 'foo').then(function() {
            t.fail('Resolve when there is no image');
        }, function(err) {
            t.equal(err.message, 'Not Found', 'Rejects if there is no image with message `No Found`.');
        })
    })
});
