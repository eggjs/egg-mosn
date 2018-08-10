'use strict';

const assert = require('assert');
const Base = require('sdk-base');
const urlparse = require('url').parse;
const httpclient = require('urllib');

class MosnRegistry extends Base {
  constructor(options = {}) {
    assert(options.appName, '[MosnRegistry] options.appName is required');
    assert(options.proxyPort, '[MosnRegistry] options.proxyPort is required');
    super(Object.assign(options, { initMethod: '_init' }));

    this.httpclient = options.httpclient || httpclient;
    this.endpoint = options.endpoint || 'http://127.0.0.1:13330';
  }

  async _init() {
    const { antShareCloud = false, appName, dataCenter, zone, registryEndpoint, accessKey, secretKey } = this.options;
    await this._request('/configs/application', {
      antShareCloud,
      appName,
      dataCenter,
      zone,
      registryEndpoint,
      accessKey,
      secretKey,
    });
  }

  async _request(path, param) {
    const url = this.endpoint + path;
    const res = await this.httpclient.request(url, {
      method: 'POST',
      dataType: 'json',
      contentType: 'json',
      data: param,
    });
    if (res.status === 200) {
      const result = res.data;
      if (!result.success) {
        const err = new Error(result.errorMessage);
        err.param = param;
        throw err;
      }
      return result;
    }
    const err = new Error(`failed to request ${url}`);
    err.param = param;
    err.statusCode = res.status;
    throw err;
  }

  async register(config) {
    const interfaceName = config.interfaceName;
    const obj = urlparse(config.url, true);
    const metaInfo = {
      appName: this.options.appName,
      protocol: 'bolt',
      version: obj.query.version,
      serializeType: obj.query.serialization,
    };
    const serviceName = interfaceName + ':' + obj.query.version;
    return await this._request('/services/publish', {
      serviceName,
      providerMetaInfo: metaInfo,
    });
  }

  async unRegister(config) {
    const interfaceName = config.interfaceName;
    const obj = urlparse(config.url, true);
    const serviceName = interfaceName + ':' + obj.query.version;
    return await this._request('/services/unpublish', {
      serviceName,
    });
  }

  subscribe(config, listener) {
    const serviceName = config.interfaceName + ':' + config.version;
    this._request('/services/subscribe', {
      serviceName,
    })
      .then(() => {
        listener([ 'bolt://127.0.0.1:' + this.options.proxyPort ]);
      })
      .catch(err => { this.emit('error', err); });
  }

  unSubscribe(config) {
    const serviceName = config.interfaceName + ':' + config.version;
    this._request('/services/unsubscribe', {
      serviceName,
    }).catch(err => {
      this.emit('error', err);
    });
  }

  async close() {
    // noop
  }
}

module.exports = MosnRegistry;
