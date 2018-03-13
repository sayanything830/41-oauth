'use strict';

const superagent = require('superagent');

const mocks = require('../lib/mocks');
const server = require('../../lib/server');
require('jest');

const PORT = process.env.PORT;
const SONG_ENDPOINT = `:${PORT}/api/v1/song`;

describe('GET /api/v1/song', () => {
  beforeAll(() => server.start(PORT, () => console.log(`Listening on ${PORT}`)));
  beforeAll(() => mocks.auth.createOne()
    .then(data => this.mockUser = data)
  );
  afterAll(server.stop);
  afterAll(mocks.auth.removeAll);
  afterAll(mocks.song.removeAll);

  describe('Valid', () => {
    it('should return a 200 status (CREATED)', () => {
      return mocks.song.createOne()
        .then(mock => {
          return superagent.get(`${SONG_ENDPOINT}`)
            .set('Authorization', `Bearer ${mock.token}`)
            .then(res => this.res = res);
        })
        .then(() => {
          expect(this.res.status).toEqual(200);
        });
    });
    it('should return an array of objects', () => {
      return mocks.song.createOne()
        .then(mock => {
          return superagent.get(`${SONG_ENDPOINT}`)
            .set('Authorization', `Bearer ${mock.token}`)
            .then(res => this.res = res);
        })
        .then(() => expect(Array.isArray(this.res.body)).toBeTruthy());
    });
    it('Objects in the array should contain the correct properties', () => {
      let songMock = null;
      return mocks.song.createOne()
        .then(mock => songMock = mock)
        .then(mock => {
          return superagent.get(`${SONG_ENDPOINT}`)
            .set('Authorization', `Bearer ${mock.token}`)
            .then(res => this.res = res);
        })
        .then(() => {
          expect(this.res.body[0]).toHaveProperty('artist');
          expect(this.res.body[0]).toHaveProperty('title');
          expect(this.res.body[0]).toHaveProperty('userId');
          expect(this.res.body[0]).toHaveProperty('_id');
          expect(this.res.body[0].userId).toEqual(songMock.song.userId.toString());
        });
    });
  });
});