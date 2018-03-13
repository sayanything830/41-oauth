'use strict';

const superagent = require('superagent');

const mocks = require('../lib/mocks');
const server = require('../../lib/server');
require('jest');

const PORT = process.env.PORT;
const SONG_ENDPOINT = `:${PORT}/api/v1/song`;

describe('POST /api/v1/song', () => {
  beforeAll(() => server.start(PORT, () => console.log(`Listening on ${PORT}`)));
  beforeAll(() => mocks.auth.createOne()
    .then(data => this.mockUser = data)
  );
  afterAll(server.stop);
  afterAll(mocks.auth.removeAll);
  afterAll(mocks.song.removeAll);

  describe('Valid', () => {
    it('should return a 201 status (CREATED)', () => {
      let songMock = null;
      return mocks.song.createOne()
        .then(mock => songMock = mock)
        .then(mock => {
          return superagent.post(`${SONG_ENDPOINT}`)
            .set('Authorization', `Bearer ${mock.token}`)
            .send({
              artist: 'Michael Jackson',
              title: 'Thriller',
            });
        })
        .then(res => {
          expect(res.status).toEqual(201);
          expect(res.body).toHaveProperty('artist');
          expect(res.body).toHaveProperty('title');
          expect(res.body).toHaveProperty('userId');
          expect(res.body).toHaveProperty('_id');
          expect(res.body.userId).toEqual(songMock.song.userId.toString());
        });
    });
  });

  describe('Invalid', () => {
    it('should return a 401 status (NOT AUTHORIZED) with a bad token', () => {
      return superagent.post(`${SONG_ENDPOINT}`)
        .set('Authorization', 'Bearer BADTOKEN')
        .catch(err => expect(err.status).toEqual(401));
    });

    it('should return a 400 status (BAD REQUEST) with an improperly formatted body', () => {
      return superagent.post(`${SONG_ENDPOINT}`)
        .set('Authorization', `Bearer ${this.mockUser.token}`)
        .send({})
        .catch(err => expect(err.status).toEqual(400));
    });
    it('should return an error for missing artist', () => {
      return superagent.post(`${SONG_ENDPOINT}`)
        .set('Authorization', `Bearer ${this.mockUser.token}`)
        .send({
          artist: '',
          song: 'Thriller',
        })
        .catch(err => expect(err.status).toEqual(400));
    });
    it('should return an error for missing artist', () => {
      return superagent.post(`${SONG_ENDPOINT}`)
        .set('Authorization', `Bearer ${this.mockUser.token}`)
        .send({
          artist: 'Michael Jackson',
          song: '',
        })
        .catch(err => expect(err.status).toEqual(400));
    });
  });
});

