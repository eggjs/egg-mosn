'use strict';

class UnPublishService {
  constructor(opts) {
    this.serviceName = opts.serviceName;
    this.protocolType = 'DEFAULT';
    this.port = opts.port;
  }
}

module.exports = UnPublishService;
