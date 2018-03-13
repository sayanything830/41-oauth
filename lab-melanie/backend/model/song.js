'use strict';

const mongoose = require('mongoose');
const Auth = require('./auth');
const debug = require('debug')('http:song');

const Song = mongoose.Schema({
  artist: {type: String, required: true},
  title: {type: String, required: true},
  lyrics: {type: String, required: true},
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'auth', required: true},
});

Song.pre('save', function(next) {
  Auth.findById(this.userId)
    .then(user => {
      user.playlist = [...new Set(user.playlist).add(this._id)];
      user.persona = '';
      user.save();
    })
    .then(next)
    .catch(() => next(new Error('Validation Error, failed to save song')));
});

Song.post('remove', function(doc, next) {
  debug('in song.post');
  Auth.findById(doc.userId)
    .then(user => {
      user.playlist = user.playlist.filter(v => v.toString() !== doc._id.toString());
      user.persona = '';
      user.save();
    })
    .then(next)
    .catch(next);
});

module.exports = mongoose.model('song', Song);
