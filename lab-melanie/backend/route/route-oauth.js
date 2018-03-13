'use strict';
const superagent = require('superagent');
const User = require('../model/auth');


const GOOGLE_OAUTH_URL = 'https://www.googleapis.com/oauth2/v4/token';
const OPEN_ID_URL = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';

module.exports = router => {
  router.get('/oauth/google/code',(request,response) => {

    if(!request.query.code){
      response.redirect(process.env.CLIENT_URL);
    } else {
      console.log('__CODE__',request.query.code);
      return superagent.post(GOOGLE_OAUTH_URL)
        .type('form')
        .send({
          code: request.query.code,
          grant_type: 'authorization_code',
          client_id: process.env.GOOGLE_OAUTH_ID,
          client_secret: process.env.GOOGLE_OAUTH_SECRET,
          redirect_uri: `${process.env.API_URL}/api/v1/oauth/google/code`,
        })
        .then(tokenResponse => {
          console.log('Step 3.2 - GOOGLE TOKEN');

          if(!tokenResponse.body.access_token)
            response.redirect(process.env.CLIENT_URL);

          const token = tokenResponse.body.access_token;
          console.log('token', token);
          return superagent.get(OPEN_ID_URL)
            .set('Authorization', `Bearer ${token}`);
        })
        .then(openIDResponse => {
          console.log('Back from OpenID');
          console.log(openIDResponse.body);


          //------------
          let newUser = {
            username: openIDResponse.body.name,
            email: openIDResponse.body.email,
          };
          //-----------

          let user = new User(newUser);
          console.log('New user: ', user);
          user.generateToken()
            .then(token => {
              console.log('token', token);
              response.cookie('X-401d21-OAuth-Token', token);
              response.redirect(process.env.CLIENT_URL);
            });

        })
        .catch(error => {
          console.log('__ERROR__',error.message);
          response.cookie('X-401d21-OAuth-Token','');
          response.redirect(process.env.CLIENT_URL + '?error=oauth');
        });
    }
  });
};
