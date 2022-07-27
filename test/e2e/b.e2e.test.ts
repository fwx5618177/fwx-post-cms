import puppeteer from 'puppeteer'

describe('Login', () => {
    it('should login with failure', async () => {
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: { width: 1920, height: 1080 },
            args: ['--start-maximized'],
        })
        const page: puppeteer.Page = await browser.newPage()
        await page.goto(`http://localhost:5173/`)
        for (let i = 0; i < 100; i++) {
            await page.waitForSelector('.logo')
            await page.click('.logo')
        }

        await page.close()
        browser.close()
    })
})
