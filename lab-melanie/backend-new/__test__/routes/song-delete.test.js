'use strict';

const superagent = require('superagent');

const mocks = require('../lib/mocks');
const server = require('../../lib/server');
require('jest');

const PORT = process.env.PORT;
const SONG_ENDPOINT = `:${PORT}/api/v1/song`;

describe('DELETE /api/v1/song/_id?', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterAll(mocks.auth.removeAll);
  afterAll(mocks.song.removeAll);

  describe('Valid', () => {
    it('should return a 204 status (NO CONTENT) on a successful deletion', () => {
      return mocks.song.createOne(10)
        .then(mock => {
          return superagent.delete(`${SONG_ENDPOINT}/${mock.song._id}`)
            .set('Authorization', `Bearer ${mock.token}`);
        })
        .then(res => expect(res.status).toBe(204));
    });
  });

  describe('Invalid', () => {
    it('should return a 404 status (NOT FOUND) with a bad id', () => {
      return mocks.song.createOne(10)
        .then(mock => {
          return superagent.delete(`${SONG_ENDPOINT}/fudgedId`)
            .set('Authorization', `Bearer ${mock.token}`);
        })
        .catch(err => expect(err.status).toBe(404));
    });

    it('should return a 401 status (UNAUTHORIZED) with a bad token', () => {
      return mocks.song.createOne(10)
        .then(mock => {
          return superagent.delete(`${SONG_ENDPOINT}/${mock.song._id}`)
            .set('Authorization', 'Bearer BADTOKEN');
        })
        .catch(err => expect(err.status).toBe(401));
    });
    it('should return a 401 status (UNAUTHORIZED) with a bad token', () => {
      return mocks.song.createOne(10)
        .then(songMock => {
          this.songMock = songMock;
          return mocks.auth.createOne()
            .then(user => {
              return superagent.delete(`${SONG_ENDPOINT}/${this.songMock.song._id}`)
                .set('Authorization', `Bearer ${user.token}`);
            });
        })
        .catch(err => expect(err.status).toBe(401));
    });
  });
});

