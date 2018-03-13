'use strict';

// Test Dependencies
const superagent = require('superagent');
const server = require('../../lib/server');
const mocks = require('../lib/mocks');
require('jest');

// Environment Variables
const PORT = process.env.PORT;
const ENDPOINT_PERSONA = `:${PORT}/api/v1/persona`;

describe('Testing Api/v1/persona route for Watson integration', () => {
  beforeAll(server.start);
  beforeAll(() => mocks.auth.createOne().then(user => this.mockUser = user));
  beforeAll(() => mocks.song.createOne(20).then(song => this.mockInvalidSong = song));
  beforeAll(() => mocks.song.createOne(100).then(song => this.mockValidSong = song));
  afterAll(server.stop);
  afterAll(mocks.auth.removeAll);
  afterAll(mocks.song.removeAll);
  describe('Invalid Inputs', () => {
    it('Should return an error for not having a large enough sample of lyrics (less than 100 words) when no songs are chosen', () => {
      return superagent.get(ENDPOINT_PERSONA)
        .set('Authorization', `Bearer ${this.mockUser.token}`)
        .catch(err => expect(err.response.text).toMatch(/Not Long Enough/));
    });
    it('Should return an error for not having a large enough sample of lyrics (less than 100 words) when less than 100 words of lyrics are stored', () => {
      return superagent.get(ENDPOINT_PERSONA)
        .set('Authorization', `Bearer ${this.mockInvalidSong.token}`)
        .catch(err => expect(err.response.text).toMatch(/Not Long Enough/));
    });
  });
  describe('Valid Inputs', () => {
    it('Should return a valid JSON Personality object', () => {
      return superagent.get(ENDPOINT_PERSONA)
        .set('Authorization', `Bearer ${this.mockValidSong.token}`)
        .then(res => expect(res.status).toEqual(200));
    });
    it('Should return a valid JSON Personality object', () => {
      return superagent.get(ENDPOINT_PERSONA)
        .set('Authorization', `Bearer ${this.mockValidSong.token}`)
        .then(res => expect(res.status).toEqual(200));
    });
  });
});
