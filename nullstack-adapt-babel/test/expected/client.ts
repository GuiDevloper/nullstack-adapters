import $runtime from 'nullstack/runtime';import Nullstack from 'nullstack';
import Application from './src/Application';
const context = Nullstack.start(Application);
context.start = async function start() {};
export default context;
if (module.hot) {
  $runtime.restart(module, './src/Application', Application);
}