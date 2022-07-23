const path = require('path')
import { devices } from 'puppeteer'
import puppeteer from 'puppeteer'

describe('/ (Home Page)', () => {
    let page: puppeteer.Page = null as unknown as puppeteer.Page
    const iPhonex = devices['iPhone X']
    beforeAll(async () => {
        page = await globalThis.__BROWSER_GLOBAL__.newPage()
        await page.goto(`${URL}`, { waitUntil: 'domcontentloaded' })
        await page.emulate(iPhonex)
        await page.setViewport({ width: 375, height: 812, isMobile: false })
    })

    afterAll(async () => {
        await page.close()
    })

    it('should load without error', async () => {
        const text = await page.evaluate(() => document.body.textContent)

        for (let i = 0; i < 100; i++) {
            await page.click('#test_id')
        }

        expect(text).toContain('Reactcount')
    })

    test('Take screenshot of home pag', async () => {
        await page.screenshot({
            path: path.join(__dirname, `../screenshots/home.jpg`),
            type: 'jpeg',
            fullPage: true,
        })
    })
})
