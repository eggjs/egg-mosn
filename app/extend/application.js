'use strict';

const MosnRegistry = require('../../lib/client');
// Symbols
const _rpcRegistry = Symbol.for('egg#rpcRegistry');

module.exports = {
  get rpcRegistry() {
    if (!this[_rpcRegistry]) {
      const options = this.config.mosn;
      this[_rpcRegistry] = new MosnRegistry(Object.assign({
        httpclient: this.httpclient,
        appName: this.config.name,
        zone: this.config.zone,
      }, options));
      this[_rpcRegistry].on('error', err => { this.coreLogger.error(err); });
      this.beforeStart(async () => {
        await this[_rpcRegistry].ready();
      });
      this.beforeClose(async () => {
        await this[_rpcRegistry].close();
      });
    }
    return this[_rpcRegistry];
  },
};
