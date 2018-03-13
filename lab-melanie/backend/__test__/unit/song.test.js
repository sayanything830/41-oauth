'use strict';

const Song = require('../../model/song.js');

describe('Song Module', function () {
  const mock = {
    artist: 'Smash Mouth',
    title: 'All Star',
    lyrics: `Hey now, you're an all star!`,
    userId: '1234567890',
  };
  const song = new Song();

  describe('#Song', function () {
    it('should have an _id property automatically generated', () => {
      expect(song).toHaveProperty('_id');
    });

    it('should be an instance of an Object', () => {
      expect(song).toBeInstanceOf(Object);
    });

    it('should have an "artist" property', () => {
      expect(new Song(mock)).toHaveProperty('artist');
    });

    it('should have an "title" property', () => {
      expect(new Song(mock)).toHaveProperty('title');
    });

    it('should have an "lyrics" property', () => {
      expect(new Song(mock)).toHaveProperty('lyrics');
    });

    it('should have an "userId" property', () => {
      expect(new Song(mock)).toHaveProperty('userId');
    });
  });
});

