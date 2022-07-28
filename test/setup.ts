import chalk from 'chalk'
import puppeteer from 'puppeteer'
const path = require('path')
const os = require('os')
const mkdirp = require('mkdirp')
const fs = require('fs')
// import jsdom from 'jsdom'

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup')
// const DIR = path.join(__dirname, "jest_puppeteer_global_setup");
// const exposedProperties = ['window', 'navigator', 'document']
// const { window } = jsdom

export default async function () {
    console.log(chalk.green('Setup Puppeteer'))
    const browser = await puppeteer.launch({})
    // This global is not available inside tests but only in global teardown
    global.__BROWSER_GLOBAL__ = browser
    // Instead, we expose the connection details via file system to be used in tests
    mkdirp.sync(DIR)
    fs.writeFileSync(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint())

    // global.window = window
    // global.document = window.document
    // Object.keys(document.defaultView as Window & typeof globalThis).forEach(property => {
    //     if (typeof global[property] === 'undefined') {
    //         // exposedProperties.push(property)
    //         global[property] = (document.defaultView as Window & typeof globalThis)[property]
    //     }
    // })

    global.navigator = {
        ...global.navigator,
        userAgent: 'node.js',
    }
}
