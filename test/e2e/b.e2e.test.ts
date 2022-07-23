import puppeteer from "puppeteer";

describe("Login", () => {
  it("should login with failure", async () => {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1920, height: 1080 },
      args: ["--start-maximized"],
    });
    const page: puppeteer.Page = await browser.newPage();
    await page.goto(`${URL}`);
    for (let i = 0; i < 100; i++) {
      await page.click("#test_id");
    }

    await page.close();
    browser.close();
  });
});
