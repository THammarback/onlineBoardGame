"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _web = require("solid-js/web");

var _solidJs = require("solid-js");

const _tmpl$ = /*#__PURE__*/(0, _web.template)(`<li></li>`, 2),
      _tmpl$2 = /*#__PURE__*/(0, _web.template)(`<section class="chat"><ol class="chatList" id="chatList"></ol><form><input type="text" name="message"><input type="submit"></form></section>`, 8);

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// import styles from './Chat.module.css';
var Chat = function Chat(_ref) {
  var session = _ref.session;

  var ChatItem = function ChatItem(_ref2) {
    var children = _ref2.children;
    return function () {
      var _el$ = _tmpl$.cloneNode(true);

      (0, _web.insert)(_el$, children);
      return _el$;
    }();
  };

  session.socket.on('receiveChat', function (newMessages) {
    console.log(newMessages, session.messages.get());
    session.messages.set(function (currentMessages) {
      return [].concat(_toConsumableArray(currentMessages), _toConsumableArray(newMessages));
    });
  });

  var sendChat = function sendChat(e) {
    e.preventDefault();
    var newMessage = e.target.message.value;
    session.socket.emit('sendChat', newMessage);
    session.messages.set(function (currentMessages) {
      console.log(session.messages.get());
      return [].concat(_toConsumableArray(currentMessages), [newMessage]);
    });
  };

  return function () {
    var _el$2 = _tmpl$2.cloneNode(true),
        _el$3 = _el$2.firstChild,
        _el$4 = _el$3.nextSibling;

    (0, _web.insert)(_el$3, (0, _web.createComponent)(_solidJs.For, {
      get each() {
        return session.messages.get();
      },

      children: function children(message, i) {
        return (0, _web.createComponent)(ChatItem, {
          children: message
        });
      }
    }));

    _el$4.addEventListener("submit", sendChat);

    return _el$2;
  }();
};

var _default = Chat;
exports["default"] = _default;