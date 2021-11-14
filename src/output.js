(function (modules) {
    function readModule(id) {
      const {fn,mappings} = modules[id]
      const _module = {}
      const _exports = (_module.exports = {})
      function localrRequire(fullPath) {
        return readModule(mappings[fullPath])
      }
      fn(_module, _module.exports, localrRequire)
      return _module.exports
    }
    readModule(0)
  })({
    0:{
      fn:function ( module, exports,require) {
        "use strict";

var _message = _interopRequireDefault(require("d:\\HTML\\code\\sourceCode\\IMiniPack\\example\\message.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

console.log(_message["default"]);
      },
      mappings:{"d:\\HTML\\code\\sourceCode\\IMiniPack\\example\\message.js":1},
    },
    
    1:{
      fn:function ( module, exports,require) {
        "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _name = require("d:\\HTML\\code\\sourceCode\\IMiniPack\\example\\name.js");

var _default = "hello ".concat(_name.name, "!");

exports["default"] = _default;
      },
      mappings:{"d:\\HTML\\code\\sourceCode\\IMiniPack\\example\\name.js":2},
    },
    
    2:{
      fn:function ( module, exports,require) {
        "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.name = void 0;
var name = 'world';
exports.name = name;
      },
      mappings:{},
    },
    })