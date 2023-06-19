import $runtime from 'nullstack/runtime';function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/* eslint-disable no-console */
import './Application.css';
import Nullstack from 'nullstack';
import Home from './Home';
class Application extends Nullstack {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "count", 0);
  }
  logMessage() {
    console.log('message!');
  }
  async initiate() {
    const A = {
      testServer() {
        console.log('at initiate!');
      }
    };
  }
  async prepare({
    page
  }) {
    console.log(`prepare! ${page}`);
  }
  async hydrate() {
    this.count = await Application.testServer({});
  }
  renderHead() {
    return $runtime.element("head", null, $runtime.element("link", {
      href: "https://fonts.gstatic.com",
      rel: "preconnect"
    }), $runtime.element("link", {
      href: "https://fonts.googleapis.com/css2?family=Crete+Round&family=Roboto&display=swap",
      rel: "stylesheet"
    }));
  }
  render() {
    return $runtime.element("body", null, $runtime.element(Head, null), $runtime.element($runtime.fragment, null, $runtime.element("button", {
      source: this,
      onclick: this.hydrate
    }, "Click here!"), $runtime.element($runtime.fragment, null, $runtime.element("h1", null, "count: ", this.count)), $runtime.element("a", {
      href: "/home"
    }, "Home!"), $runtime.element(Home, {
      route: "/home",
      greeting: "hello world!"
    })));
  }
}
_defineProperty(Application, "hash", 'ClientProduction___Application');
_defineProperty(Application, "testServer", $runtime.invoke("testServer", Application.hash));
_defineProperty(Application, "serverCount", 0);
export default Application;
if (module.hot) {
  $runtime.accept(module, '/ClientProduction.tsx', ["./Application.css", "nullstack", "./Home"], [{
    klass: Application,
    initiate: [],
    hashes: {
      "testServer": "e27b59d6d8e0867694186e8eb79289d2"
    }
  }]);
}