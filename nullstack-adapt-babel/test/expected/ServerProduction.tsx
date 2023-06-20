import $runtime from 'nullstack/runtime';/* eslint-disable no-console */
import './Application.css';
import Nullstack from 'nullstack';
import Home from './Home';
class Application extends Nullstack {
  count = 0;
  static serverCount = 0;
  logMessage() {
    console.log('message!');
  }
  static async testServer({
    environment
  }) {
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
export default Application;
Application.hash = "ServerProduction___Application";
if (module.hot) {
  $runtime.accept(module, '/ServerProduction.tsx', ["./Application.css", "nullstack", "./Home"], [{
    klass: Application,
    initiate: [],
    hashes: {
      "testServer": "e27b59d6d8e0867694186e8eb79289d2"
    }
  }]);
}
$runtime.register(Application, "testServer");
$runtime.register(Application);