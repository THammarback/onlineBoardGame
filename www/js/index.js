"use strict";

var _web = require("solid-js/web");

require("./index.css");

var _App = _interopRequireDefault(require("./App"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* @refresh reload */
(0, _web.render)(function () {
  return (0, _web.createComponent)(_App["default"], {});
}, document.getElementById('root'));