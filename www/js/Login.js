"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _web = require("solid-js/web");

const _tmpl$ = /*#__PURE__*/(0, _web.template)(`<section class="login"><h2>Join or create a D&D Session.</h2><div><form><input type="text" name="displayName" placeholder="Display name"><input type="text" name="sessionKey" placeholder="Session key"><input type="submit" name="create" value="Create"><input type="submit" name="join" value="Join"></form></div></section>`, 12);

// import styles from './Login.module.css';
var Login = function Login(_ref) {
  var session = _ref.session;

  var onSubmit = function onSubmit(e) {
    e.preventDefault();
    var key = e.target.sessionKey.value;
    var name = e.target.displayName.value;

    if (!name) {
      console.warn("Enter something in the Display Name key field");
      return false;
    }

    if (!key) {
      console.warn("Enter something in the session key field");
      return false;
    }

    if (e.submitter.name === "create") {
      session.socket.emit("createSession", {
        key: key,
        name: name
      }, function (res) {
        if (res.ok) {
          session.key.set(key);
        } else console.error(res);
      });
    } else if (e.submitter.name === "join") {
      session.socket.emit("joinSession", {
        key: key,
        name: name
      }, function (res) {
        if (res.ok) {
          session.key.set(key);
          console.log(session.messages.get());
          session.messages.set(res.session.messages);
        } else console.error(res);
      });
    }
  };

  return function () {
    var _el$ = _tmpl$.cloneNode(true),
        _el$2 = _el$.firstChild,
        _el$3 = _el$2.nextSibling,
        _el$4 = _el$3.firstChild;

    _el$4.addEventListener("submit", onSubmit);

    return _el$;
  }();
};

var _default = Login;
exports["default"] = _default;