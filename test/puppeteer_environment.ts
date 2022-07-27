import chalk from 'chalk'
import puppeteer from 'puppeteer'
const NodeEnvironment = require('jest-environment-node')
const path = require('path')
const os = require('os')
const fs = require('fs')

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup')

class PuppeteerEnvironment extends NodeEnvironment {
    constructor(config) {
        super(config)
    }

    async setup() {
        console.log(chalk.yellow('Setup Test Environment.'))
        await super.setup()
        const wsEndpoint = fs.readFileSync(path.join(DIR, 'wsEndpoint'), 'utf8')
        if (!wsEndpoint) {
            throw new Error('wsEndpoint not found')
        }
        this.global.__BROWSER_GLOBAL__ = await puppeteer.connect({
            browserWSEndpoint: wsEndpoint,
            defaultViewport: { width: 1920, height: 1080 },
        })

        globalThis.__BROWSER_GLOBAL__ = this.global.__BROWSER__
    }

    async teardown() {
        console.log(chalk.yellow('Teardown Test Environment.'))
        await super.teardown()
    }

    runScript(script) {
        return super.runScript(script)
    }

    getVmContext() {
        return super.getVmContext()
    }
}

export default PuppeteerEnvironment
