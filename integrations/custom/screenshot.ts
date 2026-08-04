import puppeteer from 'puppeteer';
import {PuppeteerScreenRecorder} from 'puppeteer-screen-recorder';

export async function recordPageScrollWithAnimations(
    url: string,
    outputPath: string,
    height: number = 1080,
): Promise<void> {
    console.log(`🎥 Recording ${url} at 1920x${height}`);

    const browser = await puppeteer.launch({
        headless: false,
        args: [`--window-size=1920,${height}`, '--start-maximized'],
    });
    const page = await browser.newPage();

    await page.setViewport({width: 1920, height, deviceScaleFactor: 1});
    await page.goto(url, {waitUntil: 'networkidle2'});

    const recorder = new PuppeteerScreenRecorder(page, {
        followNewTab: true,
        fps: 90,
        videoFrame: {width: 1920, height},
    });

    await recorder.start(outputPath);

    await page.evaluate(async () => {
        const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

        for (let i = 0; i < document.body.scrollHeight; i += 900) {
            window.scrollTo({top: i, behavior: 'smooth'});
            const isLast = i + 900 >= document.body.scrollHeight;
            await delay(isLast ? 500 : 1250);
        }

        window.scrollTo({top: 0, behavior: 'smooth'});
        await delay(750);
    });

    await recorder.stop();
    await browser.close();
}
