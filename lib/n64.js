/*!
 * n64.js - native int64's for node.js.
 * Copyright (c) 2017, Christopher Jeffrey (MIT License).
 * https://github.com/chjj/n64
 */

'use strict';

try {
  module.exports = require('./int64-native');
} catch (e) {
  module.exports = require('./int64');
}
