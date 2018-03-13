'use strict';

const superagent = require('superagent');

const mocks = require('../lib/mocks');
const server = require('../../lib/server');

// Const vars
const PORT = process.env.PORT;
const ENDPOINT_SIGNIN = `:${PORT}/api/v1/signin`;

describe('GET /api/v1/signup', () => {
  // Create a fake account and save the response, then get it for testing
  beforeAll(() => server.start(PORT, () => console.log(`Listening on ${PORT}`)));
  afterAll(() => server.stop());
  afterAll(() => mocks.auth.removeAll());
  beforeAll(() => {
    return mocks.auth.createOne()
      .then(mockObj => this.mockObj = mockObj)
      .then(mockObj => superagent.get(ENDPOINT_SIGNIN)
        .auth(mockObj.user.username, mockObj.password)
        .then(res => this.response = res));
  });

  describe('Valid', () => {
    it('should respond with a status of 200', () => {
      expect(this.response.status).toBe(200);
    });
  });

  describe('Invalid', () => {
    it('should get a 401 if the user could not be authenticated', () => {
      return superagent.get(ENDPOINT_SIGNIN)
        .auth('fake-username', 'fake-password')
        .catch(err => expect(err.status).toBe(401));
    });

    it('should respond with not found or path error when given an invalid path', () => {
      return superagent.get(ENDPOINT_SIGNIN)
        .send()
        .catch(err => {
          expect(err.response.text).toMatch(/Auth/);
        });
    });

    it('should respond a not found or path error when given an invalid path', () => {
      return superagent.get(ENDPOINT_SIGNIN)
        .auth('', this.mockObj.user.password)
        .catch(err => {
          expect(err.response.text).toMatch(/Auth/);
        });
    });

    it('should respond a not found or path error when given an invalid path', () => {
      return superagent.get(ENDPOINT_SIGNIN)
        .auth(this.mockObj.user.username, '')
        .catch(err => {
          expect(err.response.text).toMatch(/Auth/);
        });
    });

    it('should respond a not found or path error when given an invalid path', () => {
      return superagent.get(ENDPOINT_SIGNIN)
        .auth(this.mockObj.user.username, 'incorrectpassword')
        .catch(err => {
          expect(err.response.text).toMatch(/Auth/);
        });
    });
  });
});
