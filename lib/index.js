'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactTapEventPlugin = require('react-tap-event-plugin');

var _reactTapEventPlugin2 = _interopRequireDefault(_reactTapEventPlugin);

var _ImageViewer = require('./ImageViewer');

var _ImageViewer2 = _interopRequireDefault(_ImageViewer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _reactTapEventPlugin2.default)();

exports.default = _ImageViewer2.default;