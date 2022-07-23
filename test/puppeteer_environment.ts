import chalk from 'chalk'
import puppeteer from 'puppeteer'
import NodeEnvironment from 'jest-environment-node'
const path = require('path')
const os = require('os')
const fs = require('fs')

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup')

class PuppeteerEnvironment extends NodeEnvironment {
    constructor(config, ctx) {
        super(config, ctx)
    }

    async setup() {
        console.log(chalk.yellow('Setup Test Environment.'))
        await super.setup()
        const wsEndpoint = fs.readFileSync(path.join(DIR, 'wsEndpoint'), 'utf8')
        if (!wsEndpoint) {
            throw new Error('wsEndpoint not found')
        }
        this.global.__BROWSER__ = await puppeteer.connect({
            browserWSEndpoint: wsEndpoint,
            defaultViewport: { width: 1920, height: 1080 },
        })
    }

    async teardown() {
        console.log(chalk.yellow('Teardown Test Environment.'))
        await super.teardown()
    }

    // runScript(script) {
    //   return super.runScript(script);
    // }
}

export default PuppeteerEnvironment
