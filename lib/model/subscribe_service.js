'use strict';

class SubscribeService {
  constructor(opts) {
    this.serviceName = opts.serviceName;
    this.targetAppAddress = opts.targetAppAddress;
    // egg 不支持 WS
    this.protocolType = 'DEFAULT';
    this.vipEnforce = opts.vipEnforce;
    this.vipOnly = opts.vipOnly;
    this.localCloudFirst = opts.localCloudFirst;
  }
}

module.exports = SubscribeService;
