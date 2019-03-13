'use strict';

const MosnRegistry = require('../../lib/mosn_registry');
// Symbols
const _sofaRegistry = Symbol.for('egg#sofaRegistry');

module.exports = {
  get sofaRegistry() {
    if (!this[_sofaRegistry]) {
      const options = this.config.mosn;
      this[_sofaRegistry] = new MosnRegistry(Object.assign({
        httpclient: this.httpclient,
        appName: this.config.name,
        zone: this.config.zone,
      }, options));
      this[_sofaRegistry].on('error', err => { this.coreLogger.error(err); });
      this.beforeStart(async () => {
        await this[_sofaRegistry].ready();
      });
      this.beforeClose(async () => {
        await this[_sofaRegistry].close();
      });
    }
    return this[_sofaRegistry];
  },
};
