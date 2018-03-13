'use strict';

// sgc - Fake Response Class
module.exports = class {
  constructor(err) {
    this.error = err;
    this.code = null;
    this.message = null;
  }

  status(code) {
    this.code = code;
    return this;
  }

  send(message) {
    this.message = message;
    return this;
  }
};
