'use strict';

const Auth = require('../../model/auth.js');

describe('Auth Module', function () {
  let mock = {username: 'Yohanes', password: 'password123'};
  let auth = new Auth();

  describe('#Auth Username', function () {
    it('Should have username input as a string', () => {
      expect(auth).toHaveProperty('_id');
    });
    it('should return an object', () => {
      expect(auth).toBeInstanceOf(Object);
    });
    it('Should returh instance of new Auth', () => {
      expect(new Auth(mock)).toHaveProperty('username');
    });
    it('Should return an instance of new Auth "password"', () => {
      expect(new Auth(mock)).toHaveProperty('password');
    });
  });
});
