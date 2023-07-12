import $runtime from 'nullstack/runtime';import Nullstack from 'nullstack';
class Component1 extends Nullstack {
  static hash = 'ClientDouble___Component1';
  static server = $runtime.invoke("server", this.hash);
  render() {
    return 'Component1';
  }
}
class Component2 extends Nullstack {
  static hash = 'ClientDouble___Component2';
  async client() {
    console.log('client');
  }
  render() {
    return 'Component2';
  }
}
export { Component1, Component2 };
if (module.hot) {
  $runtime.accept(module, '/ClientDouble.tsx', ["nullstack"], [{
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