'use strict';

const { APIClientBase } = require('cluster-client');
const DataClient = require('./mosn_registry');

class APIClient extends APIClientBase {
  get DataClient() {
    return DataClient;
  }

  get delegates() {
    return {
      register: 'invoke',
      unRegister: 'invoke',
    };
  }

  subscribe(config, listener) {
    this._client.subscribe(config, listener);
  }

  unSubscribe(config) {
    this._client.unSubscribe(config);
  }

  async register(config) {
    return this._client.register(config);
  }

  async unRegister(config) {
    return this._client.unRegister(config);
  }

  get clusterOptions() {
    return {
      name: 'MosnRegistry',
    };
  }
}

module.exports = APIClient;
