'use strict';

const Auth = require('../model/auth');
const debug = require('debug')('http:watson');

const USERNAME = process.env.APP_WATSON_USERNAME;
const PASSWORD = process.env.APP_WATSON_PASSWORD;
const PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');
const errorHandler = require('./error-handler');

const watson_user = new PersonalityInsightsV3({
  username: USERNAME,
  password: PASSWORD,
  version_date: '2016-10-19',
});

module.exports = (req, res, next) => {
  debug('Watson Entry >>>>>>');
  if(req.user.persona) {
    debug('User Has Persona');
    req.watsonData = JSON.parse(req.user.persona);
    return next();
  }
  Auth.findById(req.user._id)
    .populate('playlist')
    .then(user => {
      debug('Found User');
      req.lyricText = '';
      user.playlist.map(v => req.lyricText += `${v.lyrics} `);
      debug('req.lyricText pre-Watson', req.lyricText);
    })
    .then(() => {
      debug('Firing Watson');
      if(req.lyricText.split(' ').length < 100) return errorHandler(new Error('Lyrics Sample Not Long Enough'), res);
      debug('req.lyricText in Watson', req.lyricText);
      watson_user.profile({
        content: req.lyricText,
        content_type: 'text/plain',
        consumption_preferences: true,
      }, (err, data) => {
        if (err) {
          debug('Watson Error');
          return errorHandler(err, res);
        } else {
          debug('Watson Success');
          req.watsonData = data;
          next();
        }
      });
    });
};