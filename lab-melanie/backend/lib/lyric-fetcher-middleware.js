'use strict';

const lyricFetcher = require('lyrics-fetcher');

const errorHandler = require('./error-handler');

const ERROR_MESSAGE = 'Validation Error';

module.exports = function(req, res, next) {
  let artist = req.body.artist;
  if(!artist) return errorHandler(new Error(ERROR_MESSAGE), res);

  let title = req.body.title;
  if(!title) return errorHandler(new Error(ERROR_MESSAGE), res);

  return lyricFetcher.fetch(artist, title, (err, lyrics) => {
    if(err) {
      err.message = ERROR_MESSAGE;
      return errorHandler(err, res);
    }
    // API returns this string if invalid information is passed
    if(lyrics === `Sorry, We don't have lyrics for this song yet.`) {
      return errorHandler(new Error('No lyrics found'), res);
    }

    req.body.lyrics = lyrics;
    next();
  });
};
