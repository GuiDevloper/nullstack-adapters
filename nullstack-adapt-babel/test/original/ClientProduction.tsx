/* eslint-disable no-console */
import './Application.css'
import Nullstack, {
  NullstackClientContext,
  NullstackServerContext
} from 'nullstack'

import { readFileSync } from 'fs'

import Home from './Home'

declare const Head: Application['renderHead']

class Application extends Nullstack {

  static a = 0
  b = 0
  static async _underscoredMethod(value) {
    this.a = value
  }

  _underscoredAttributeFunction = function (value) {
    this.b = value
  }

  _underscored = 0

  count = 0;
  static serverCount = 0
  text = ''

  logMessage() {
    console.log('message!')
  }

  static async testServer({ environment }: Partial<NullstackServerContext>) {
    try {
      const _A = readFileSync('')
    } catch {}
    console.log('server, envProd: ', environment.production)
    return ++this.serverCount
  }

  async initiate() {
    const A = {
      testServer() {
        console.log('at initiate!')
      },
    }
  }

  async prepare({ page }: NullstackClientContext) {
    console.log(`prepare! ${page}`)
  }

  async hydrate() {
    this.count = await Application.testServer({})
    this._underscoredMethod(1)
    this._underscoredAttributeFunction(1)
  }

  renderHead() {
    return (
      <head>
        <link href="https://fonts.gstatic.com" rel="preconnect" />
        <link
          href="https://fonts.googleapis.com/css2?family=Crete+Round&family=Roboto&display=swap"
          rel="stylesheet"
        />
      </head>
    )
  }

  renderNestedInnerComponent() {
    return <div data-nested />
  }

  renderInnerReference({ prop }) {
    return <div data-reference={prop} />
  }

  renderInnerComponent({ children, reference: Reference }) {
    return (
      <div class="InnerComponent">
        <p> Inner Component </p>
        <NestedInnerComponent />
        <Reference prop />
        {children}
      </div>
    )
  }

  renderRepeated({ number }) {
    return <div data-repeated={number} />
  }

  render() {
    return (
      <body>
        <Head />
        <InnerComponent reference={this.renderInnerReference}>
          children
        </InnerComponent>
        <Repeated number={1} />
        <Repeated number={2} />
        <>
          <button
            onclick={this.hydrate}
            onkeyup={this.hydrate}
            onkeydown={this.hydrate}
          >Click here!</button>
          <input
            bind={this.text}
            onkeyup={this.hydrate}
            onkeydown={this.hydrate}
          />
          <>
            <h1>count: {this.count}</h1>
          </>
          <a href="/home">Home!</a>
          <Home route="/home" greeting="hello world!" />
        </>
      </body>
    )
  }

}

export default Application
