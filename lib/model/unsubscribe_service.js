'use strict';

class UnSubscribeService {
  constructor(opts) {
    this.serviceName = opts.serviceName;
    this.targetAppAddress = opts.targetAppAddress;
    this.protocolType = opts.protocolType;
  }
}

module.exports = UnSubscribeService;
