"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _web = require("solid-js/web");

var _solidJs = require("solid-js");

var _helpers = require("./helpers");

var _Login = _interopRequireDefault(require("./Login"));

var _socket = require("socket.io-client");

var _Chat = _interopRequireDefault(require("./Chat"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

const _tmpl$ = /*#__PURE__*/(0, _web.template)(`<section class="HUH"></section>`, 2);

var socket = (0, _socket.io)('localhost:4000');

var App = function App() {
  var session = {
    messages: (0, _helpers.state)([]),
    socket: socket,
    key: (0, _helpers.state)('')
  };
  socket.on("disconnect", function () {
    session.key.set('');
    session.messages.set([]);
  });
  return (0, _web.createComponent)(_solidJs.Show, {
    get when() {
      return session.key.get();
    },

    get fallback() {
      return (0, _web.createComponent)(_Login["default"], {
        session: session
      });
    },

    get children() {
      var _el$ = _tmpl$.cloneNode(true);

      (0, _web.insert)(_el$, (0, _web.createComponent)(_Chat["default"], {
        session: session
      }));
      return _el$;
    }

  });
};

var _default = App;
exports["default"] = _default;