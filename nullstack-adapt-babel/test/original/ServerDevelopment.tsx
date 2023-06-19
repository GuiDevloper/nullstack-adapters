/* eslint-disable no-console */
import './Application.css'
import Nullstack, {
  NullstackClientContext,
  NullstackServerContext
} from 'nullstack'

import Home from './Home'

declare const Head: Application['renderHead']

class Application extends Nullstack {

  count = 0;
  static serverCount = 0

  logMessage() {
    console.log('message!')
  }

  static async testServer({ environment }: Partial<NullstackServerContext>) {
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

  render() {
    return (
      <body>
        <Head />
        <>
          <button onclick={this.hydrate}>Click here!</button>
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
