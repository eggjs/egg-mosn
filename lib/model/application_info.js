'use strict';

const assert = require('assert');

class ApplicationInfo {
  constructor(opts) {
    assert(opts.appName);
    this.antShareCloud = !!opts.antShareCloud;
    this.dataCenter = opts.dataCenter || '';
    this.appName = opts.appName;
    this.zone = opts.zone || '';
    this.registryEndpoint = opts.registryEndpoint || '';
    this.accessKey = opts.accessKey || '';
    this.secretKey = opts.secretKey || '';
    this.deployMode = !!opts.deployMode;
    this.masterSystem = !!opts.masterSystem;
    this.cloudName = opts.cloudName || '';
    this.hostMachine = opts.hostMachine || '';
  }
}

module.exports = ApplicationInfo;
