import $runtime from 'nullstack/runtime';var _jsxFileName = "C:\\projects\\nullstack-adapters\\nullstack-adapt-babel\\test\\original\\ServerDevelopment.tsx";
/* eslint-disable no-console */
import './Application.css';
import Nullstack from 'nullstack';
import { readFileSync } from 'fs';
import Home from './Home';
class Application extends Nullstack {
  static hash = 'ServerDevelopment___Application';
  static a = 0;
  b = 0;
  static async _underscoredMethod(value) {
    this.a = value;
  }
  _underscoredAttributeFunction = function (value) {
    this.b = value;
  };
  _underscored = 0;
  count = 0;
  static serverCount = 0;
  text = '';
  logMessage() {
    console.log('message!');
  }
  static async testServer({
    environment
  }) {
    try {
      const _A = readFileSync('');
    } catch {}
    console.log('server, envProd: ', environment.production);
    return ++this.serverCount;
  }
  async initiate() {
    const A = {
      testServer() {
        console.log('at initiate!');
      }
    };
    A.testServer();
    Application.testServer({});
  }
  async prepare({
    page
  }) {
    console.log(`prepare! ${page}`);
  }
  async hydrate() {
    this.count = await Application.testServer({});
    this._underscoredMethod(1);
    this._underscoredAttributeFunction(1);
  }
  renderHead() {
    return $runtime.element("head", {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 67,
        columnNumber: 7
      }
    }, $runtime.element("link", {
      href: "https://fonts.gstatic.com",
      rel: "preconnect",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 68,
        columnNumber: 9
      }
    }), $runtime.element("link", {
      href: "https://fonts.googleapis.com/css2?family=Crete+Round&family=Roboto&display=swap",
      rel: "stylesheet",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 69,
        columnNumber: 9
      }
    }));
  }
  renderHead2() {
    return false;
  }
  renderNestedInnerComponent() {
    return $runtime.element("div", {
      "data-nested": true,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 82,
        columnNumber: 12
      }
    });
  }
  renderInnerReference({
    prop
  }) {
    return $runtime.element("div", {
      "data-reference": prop,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 86,
        columnNumber: 12
      }
    });
  }
  renderInnerComponent({
    children,
    reference: Reference
  }) {
    const NestedInnerComponent = this.renderNestedInnerComponent;
    return $runtime.element("div", {
      class: "InnerComponent",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 91,
        columnNumber: 7
      }
    }, $runtime.element("p", {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 92,
        columnNumber: 9
      }
    }, " Inner Component "), $runtime.element(NestedInnerComponent, {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 93,
        columnNumber: 9
      }
    }), $runtime.element(Reference, {
      prop: true,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 94,
        columnNumber: 9
      }
    }), children);
  }
  renderRepeated({
    number
  }) {
    return $runtime.element("div", {
      "data-repeated": number,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 101,
        columnNumber: 12
      }
    });
  }
  render() {
    const Repeated = this.renderRepeated;
    const InnerComponent = this.renderInnerComponent;
    const Head2 = this.renderHead2;
    const Head = this.renderHead;
    return $runtime.element("body", {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 106,
        columnNumber: 7
      }
    }, $runtime.element(Head, {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 107,
        columnNumber: 9
      }
    }), $runtime.element(Head2, {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 108,
        columnNumber: 9
      }
    }), $runtime.element(InnerComponent, {
      reference: this.renderInnerReference,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 109,
        columnNumber: 9
      }
    }, "children"), $runtime.element(Repeated, {
      number: 1,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 112,
        columnNumber: 9
      }
    }), $runtime.element(Repeated, {
      number: 2,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 113,
        columnNumber: 9
      }
    }), $runtime.element($runtime.fragment, null, $runtime.element("button", {
      source: this,
      onclick: this.hydrate,
      onkeyup: this.hydrate,
      onkeydown: this.hydrate,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 115,
        columnNumber: 11
      }
    }, "Click here!"), $runtime.element("input", {
      bind: {
        object: this,
        property: 'text'
      },
      source: this,
      onkeyup: this.hydrate,
      onkeydown: this.hydrate,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 120,
        columnNumber: 11
      }
    }), $runtime.element($runtime.fragment, null, $runtime.element("h1", {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 126,
        columnNumber: 13
      }
    }, "count: ", this.count)), $runtime.element("a", {
      href: "/home",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 128,
        columnNumber: 11
      }
    }, "Home!"), $runtime.element(Home, {
      route: "/home",
      greeting: "hello world!",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 129,
        columnNumber: 11
      }
    })));
  }
}
$runtime.register(Application, "testServer");
$runtime.register(Application);
export default Application;
if (module.hot) {
  $runtime.accept(module, '/ServerDevelopment.tsx', ["./Application.css", "nullstack", "nullstack", "fs", "./Home"], [{
    klass: Application,
    initiate: ["testServer", "testServer", "testServer"],
    hashes: {
      "testServer": "e27b59d6d8e0867694186e8eb79289d2"
    }
  }]);
}