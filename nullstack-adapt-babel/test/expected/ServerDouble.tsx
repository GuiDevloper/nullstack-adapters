import $runtime from 'nullstack/runtime';import Nullstack from 'nullstack';
class Component1 extends Nullstack {
  static hash = 'ServerDouble___Component1';
  static async server() {
    console.log("server");
  }
  static async _private() {
    console.log("server");
  }
  render() {
    return 'Component1';
  }
}
$runtime.register(Component1, "server");
$runtime.register(Component1);
class Component2 extends Nullstack {
  static hash = 'ServerDouble___Component2';
  static async _private() {
    console.log("server");
  }
  async client() {
    console.log('client');
  }
  render() {
    return 'Component2';
  }
}
$runtime.register(Component2);
export { Component1, Component2 };
if (module.hot) {
  $runtime.accept(module, '/ServerDouble.tsx', ["nullstack"], [{
    klass: Component1,
    initiate: [],
    hashes: {
      "server": "cf1e8c14e54505f60aa10ceb8d5d8ab3"
    }
  }, {
    klass: Component2,
    initiate: [],
    hashes: {}
  }]);
}