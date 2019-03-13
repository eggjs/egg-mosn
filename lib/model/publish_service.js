'use strict';

class PublishService {
  constructor(opts) {
    this.serviceName = opts.serviceName;
    // egg 不支持 WS 协议
    this.protocolType = 'DEFAULT';
    // kv 值, 作为 pub 出去 url 的 query
    this.providerMetaInfo = opts.providerMetaInfo;
  }
}

module.exports = PublishService;
