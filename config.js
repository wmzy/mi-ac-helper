const pkg = require('./package');
const config = require('rc')(pkg.name);

if (!config.cookie) {
  console.log('no cookie');
  process.exit(1);
}

module.exports = config;
