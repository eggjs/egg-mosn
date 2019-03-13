'ues strict';

module.exports = {
  write: true,
  plugin: 'autod-egg',
  prefix: '^',
  devprefix: '^',
  exclude: [],
  devdep: [
    'autod',
    'autod-egg',
    'egg',
    'egg-ci',
    'egg-bin',
    'eslint',
    'eslint-config-egg',
    'egg-rpc-generator',
    'contributors',
  ],
  keep: [],
  semver: [],
};
