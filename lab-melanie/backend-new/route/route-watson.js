'use strict';

const watson = require('../lib/watson');
const errorHandler = require('../lib/error-handler');
const bearerAuthMiddleWare = require('../lib/bearer-auth-middleware');

module.exports = router => {
  router.route('/persona')
    .get(bearerAuthMiddleWare, watson, (req, res) => {
      req.user.persona = JSON.stringify(req.watsonData);
      req.user.save()
        .then(() => res.status(200).json(req.watsonData))
        .catch(err => {
          console.log('>>>>>>>>>>>>>>>>>> ERROR <<<<<<<<<<<<<<<<<<', err.message);
          return errorHandler(err, res);
        });
    });
};