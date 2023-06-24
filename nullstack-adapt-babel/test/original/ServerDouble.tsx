import Nullstack from 'nullstack';

class Component1 extends Nullstack {

  static async server() { console.log("server") }
  static async _private() { console.log("server") } 
  
  render() {
    return 'Component1'
  }

}

class Component2 extends Nullstack {

  static async _private() { console.log("server") }
  async client() { console.log('client') }
  
  render() {
    return 'Component2'
  }

}

export { Component1, Component2 }