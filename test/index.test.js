'use strict';

const path = require('path');
const mm = require('egg-mock');
const assert = require('assert');
const sleep = require('mz-modules/sleep');
const rimraf = require('mz-modules/rimraf');
const mesh = require('./support/fake_mesh');

describe('test/index.test.js', () => {

  async function cleanDir() {
    await Promise.all([
      rimraf(path.join(__dirname, 'fixtures/apps/mesh-rpc/app/proxy')),
      rimraf(path.join(__dirname, 'fixtures/apps/mesh-rpc/logs')),
      rimraf(path.join(__dirname, 'fixtures/apps/mesh-rpc/run')),
    ]);
  }

  let app;
  before(async function() {
    await mesh.start();
    app = mm.app({
      baseDir: 'apps/mesh-rpc',
    });
    await app.ready();
    await sleep(1000);
  });
  after(async function() {
    await app.close();
    await cleanDir();
    await mesh.stop();
  });

  it('should invoke ok', async function() {
    const ctx = app.createAnonymousContext();
    const res = await ctx.proxy.protoService.echoObj({
      name: 'gxcsoccer',
      group: 'B',
    });
    console.log(res);
    assert.deepEqual(res, {
      code: 200,
      message: 'hello gxcsoccer, you are in B',
    });
  });
});
