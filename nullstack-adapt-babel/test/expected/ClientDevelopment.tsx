import $runtime from 'nullstack/runtime';var _jsxFileName = "C:\\projects\\nullstack-adapters\\nullstack-adapt-babel\\test\\original\\ClientDevelopment.tsx";
/* eslint-disable no-console */
import './Application.css';
import Nullstack from 'nullstack';
import Home from './Home';
class Application extends Nullstack {
  static hash = 'ClientDevelopment___Application';
  static testServer = $runtime.invoke("testServer", this.hash);
  static a = 0;
  b = 0;
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
  async initiate() {
    const A = {
      testServer() {
        console.log('at initiate!');
      }
    };
  }
  async prepare(_ref) {
    let {
      page
    } = _ref;
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
        lineNumber: 65,
        columnNumber: 7
      }
    }, $runtime.element("link", {
      href: "https://fonts.gstatic.com",
      rel: "preconnect",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 66,
        columnNumber: 9
      }
    }), $runtime.element("link", {
      href: "https://fonts.googleapis.com/css2?family=Crete+Round&family=Roboto&display=swap",
      rel: "stylesheet",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 67,
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
        lineNumber: 80,
        columnNumber: 12
      }
    });
  }
  renderInnerReference(_ref2) {
    let {
      prop
    } = _ref2;
    return $runtime.element("div", {
      "data-reference": prop,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 84,
        columnNumber: 12
      }
    });
  }
  renderInnerComponent(_ref3) {
    let {
      children,
      reference: Reference
    } = _ref3;
    const NestedInnerComponent = this.renderNestedInnerComponent;
    return $runtime.element("div", {
      class: "InnerComponent",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 89,
        columnNumber: 7
      }
    }, $runtime.element("p", {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 90,
        columnNumber: 9
      }
    }, " Inner Component "), $runtime.element(NestedInnerComponent, {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 91,
        columnNumber: 9
      }
    }), $runtime.element(Reference, {
      prop: true,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 92,
        columnNumber: 9
      }
    }), children);
  }
  renderRepeated(_ref4) {
    let {
      number
    } = _ref4;
    return $runtime.element("div", {
      "data-repeated": number,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 99,
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
        lineNumber: 104,
        columnNumber: 7
      }
    }, $runtime.element(Head, {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 105,
        columnNumber: 9
      }
    }), $runtime.element(Head2, {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 106,
        columnNumber: 9
      }
    }), $runtime.element(InnerComponent, {
      reference: this.renderInnerReference,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 107,
        columnNumber: 9
      }
    }, "children"), $runtime.element(Repeated, {
      number: 1,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 110,
        columnNumber: 9
      }
    }), $runtime.element(Repeated, {
      number: 2,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 111,
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
        lineNumber: 113,
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
        lineNumber: 118,
        columnNumber: 11
      }
    }), $runtime.element($runtime.fragment, null, $runtime.element("h1", {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 124,
        columnNumber: 13
      }
    }, "count: ", this.count)), $runtime.element("a", {
      href: "/home",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 126,
        columnNumber: 11
      }
    }, "Home!"), $runtime.element(Home, {
      route: "/home",
      greeting: "hello world!",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 127,
        columnNumber: 11
      }
    })));
  }
}
export default Application;
if (module.hot) {
  $runtime.accept(module, '/ClientDevelopment.tsx', ["./Application.css", "nullstack", "fs", "./Home"], [{
    klass: Application,
    initiate: [],
    hashes: {
      "testServer": "e27b59d6d8e0867694186e8eb79289d2"
    }
  }]);
}