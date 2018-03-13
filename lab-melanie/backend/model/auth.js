'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');

const Auth = mongoose.Schema({
  username: {type: String, required: true, unique: true}, //require username/password/email for user signup and compare hash for password protection
  password: {type: String, required: false},
  email: {type: String, required: true},
  playlist: [{type: mongoose.Schema.Types.ObjectId, ref: 'song'}],
  persona: {type: String},
  compareHash: {type: String, required: false},
});

Auth.methods.generatePasswordHash = function (password) {
  if(!password) return Promise.reject(new Error('Authorization failed.Password required'));

  return bcrypt.hash(password, 10) //encrypts the password and hashes it 10 times over
    .then(hash => this.password = hash)
    .then(() => this)
    .catch(err => err);
};

Auth.methods.comparePasswordHash = function (password) { //compare the hash to actual password when singing in
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (error, valid) => {
      if(error) return reject(error);
      if(!valid) return reject( new Error('Authorization Failed. Password Invalid'));
      resolve(this);
    });
  });
};

Auth.methods.generateCompareHash = function () {
  this.compareHash = crypto.randomBytes(64).toString('hex');
  return this.save()
    .then(() => Promise.resolve(this.compareHash))
    .catch(console.error);
};

Auth.methods.generateToken = function () { //allows user access to api/routes once logged in
  return this.generateCompareHash()
    .then(compareHash => {
      return jwt.sign({ token: compareHash}, process.env.APP_SECRET);
    })
    .catch(error => error);
};

module.exports = mongoose.model('auth', Auth);
