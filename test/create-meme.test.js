'use strict';

var captainApi = require('..'),
    test = require('tape');

test('createMeme', function(t) {
    t.test('create meme from an existing source', function(t) {
        t.plan(1);

        captainApi.createMeme('rQ2j6g', 'test meme', 'generator').
            then(function(link) {
                t.equal(/^http:\/\/memecaptain\.com\/gend_images\/.{6}/.test(link), true, 'generates image.');
            }, function(err) {
                t.fail('Fail to create image ' + err);
            });
    });

    t.test('not existing image', function(t) {
        t.plan(1);

        captainApi.createMeme('notExistingId', 'foo').then(function() {
            t.fail('Resolve when there is no image');
        }, function(err) {
            t.equal(err.message, 'Source image does not exist.', 'Rejects if there is no source image.');
        });
    });
});
