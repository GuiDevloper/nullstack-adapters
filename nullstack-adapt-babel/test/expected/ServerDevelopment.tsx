import $runtime from 'nullstack/runtime';/* eslint-disable no-console */
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
    return $runtime.element("head", null, $runtime.element("link", {
      href: "https://fonts.gstatic.com",
      rel: "preconnect"
    }), $runtime.element("link", {
      href: "https://fonts.googleapis.com/css2?family=Crete+Round&family=Roboto&display=swap",
      rel: "stylesheet"
    }));
  }
  renderNestedInnerComponent() {
    return $runtime.element("div", {
      "data-nested": true
    });
  }
  renderInnerReference({
    prop
  }) {
    return $runtime.element("div", {
      "data-reference": prop
    });
  }
  renderInnerComponent({
    children,
    reference: Reference
  }) {
    const NestedInnerComponent = this.renderNestedInnerComponent;
    return $runtime.element("div", {
      class: "InnerComponent"
    }, $runtime.element("p", null, " Inner Component "), $runtime.element(NestedInnerComponent, null), $runtime.element(Reference, {
      prop: true
    }), children);
  }
  renderRepeated({
    number
  }) {
    return $runtime.element("div", {
      "data-repeated": number
    });
  }
  render() {
    const Repeated = this.renderRepeated;
    const InnerComponent = this.renderInnerComponent;
    const Head = this.renderHead;
    return $runtime.element("body", null, $runtime.element(Head, null), $runtime.element(InnerComponent, {
      reference: this.renderInnerReference
    }, "children"), $runtime.element(Repeated, {
      number: 1
    }), $runtime.element(Repeated, {
      number: 2
    }), $runtime.element($runtime.fragment, null, $runtime.element("button", {
      source: this,
      onclick: this.hydrate,
      onkeyup: this.hydrate,
      onkeydown: this.hydrate
    }, "Click here!"), $runtime.element("input", {
      bind: {
        object: this,
        property: 'text'
      },
      source: this,
      onkeyup: this.hydrate,
      onkeydown: this.hydrate
    }), $runtime.element($runtime.fragment, null, $runtime.element("h1", null, "count: ", this.count)), $runtime.element("a", {
      href: "/home"
    }, "Home!"), $runtime.element(Home, {
      route: "/home",
      greeting: "hello world!"
    })));
  }
}
$runtime.register(Application, "testServer");
$runtime.register(Application);
export default Application;
if (module.hot) {
  $runtime.accept(module, '/ServerDevelopment.tsx', ["./Application.css", "nullstack", "fs", "./Home"], [{
    klass: Application,
    initiate: [],
    hashes: {
      "testServer": "e27b59d6d8e0867694186e8eb79289d2"
    }
  }]);
}