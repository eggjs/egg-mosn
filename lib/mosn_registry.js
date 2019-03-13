'use strict';

const assert = require('assert');
const Base = require('sdk-base');
const httpclient = require('urllib');
const Constants = require('./constants');
const DEFAULT_ENDPOINT = 'http://127.0.0.1:13330';
const {
  ApplicationInfo,
  PublishService,
  SubscribeService,
  UnPublishService,
  UnSubscribeService,
} = require('./model');

class MosnRegistry extends Base {
  /**
   * @constructor
   * @param {object} options -
   * @param {string} options.appName -
   * @param {number} options.proxyPort -
   * @param {string} options.endpoint - mosn endpoint, default http://127.0.0.1:13330
   * @param {boolean} options.antShareCloud -
   * @param {string} options.dataCenter -
   *
   */
  constructor(options = {}) {
    assert(options.appName, '[MosnRegistry] options.appName is required');
    assert(options.proxyPort, '[MosnRegistry] options.proxyPort is required');
    super(Object.assign(options, { initMethod: '_init' }));
    this.httpclient = options.httpclient || httpclient;
    this.endpoint = options.endpoint || DEFAULT_ENDPOINT;
  }

  async _init() {
    const appInfo = new ApplicationInfo(this.options);
    await this._request(Constants.REGISTER_APP, appInfo);
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
    const publishService = new PublishService(config);
    return await this._request(Constants.PUBLISH_SERVICE, publishService);
  }

  async unRegister(config) {
    const unPublishService = new UnPublishService(config);
    return await this._request(Constants.UN_PUBLISH_SERVICE, unPublishService);
  }

  subscribe(config, listener) {
    const subscribeService = new SubscribeService(config);
    this._request(Constants.SUBSCRIBE_SERVICE, subscribeService)
      .then(result => {
        let query = '?_SERIALIZETYPE=hessian2&p=1';
        if (result.data && result.data.length) {
          const paramIndex = result[0].indexOf('?');
          query = result[0].substring(paramIndex);
        }
        listener([ 'bolt://127.0.0.1:' + this.options.proxyPort + query ]);
      }).catch(err => { this.emit('error', err); });
  }

  unSubscribe(config) {
    const unSubscribeService = new UnSubscribeService(config);
    this._request(Constants.UN_SUBSCRIBE_SERVICE, unSubscribeService)
      .catch(err => {
        this.emit('error', err);
      });
  }

  async close() {
    // noop
  }
}

module.exports = MosnRegistry;
