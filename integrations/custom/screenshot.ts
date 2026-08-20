import puppeteer from "puppeteer-core";
import { PuppeteerScreenRecorder } from "puppeteer-screen-recorder";
import { promises as fs } from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

interface RecordProjectPageOptions {
  url: string;
  capturePath: string;
  videoPath: string;
}

const viewport = { width: 1440, height: 900 };
const run = promisify(execFile);

export async function recordProjectPage({
  url,
  capturePath,
  videoPath,
}: RecordProjectPageOptions): Promise<void> {
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH ?? "/usr/bin/google-chrome",
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      `--window-size=${viewport.width},${viewport.height}`,
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ ...viewport, deviceScaleFactor: 1 });
    await page.goto(url, { waitUntil: "networkidle2" });
    await page.evaluate(() => document.fonts.ready);
    await new Promise((resolve) => setTimeout(resolve, 500));

    await page.screenshot({
      path: capturePath as `${string}.webp`,
      type: "webp",
      quality: 88,
      captureBeyondViewport: false,
    });

    const temporaryVideoPath = `${videoPath}.mp4`;
    const recorder = new PuppeteerScreenRecorder(page as never, {
      followNewTab: false,
      fps: 30,
      quality: 85,
      ffmpeg_Path: "/usr/bin/ffmpeg",
      videoFrame: viewport,
      aspectRatio: "16:9",
      videoCodec: "libx264",
      videoCrf: 23,
      videoPreset: "veryfast",
      videoPixelFormat: "yuv420p",
    });

    await recorder.start(temporaryVideoPath);
    await page.evaluate(async () => {
      const delay = (duration: number) => new Promise((resolve) => setTimeout(resolve, duration));
      const viewportHeight = window.innerHeight;
      const maximumScroll = Math.max(0, document.documentElement.scrollHeight - viewportHeight);

      await delay(700);
      for (let position = 0; position < maximumScroll; position += viewportHeight * 0.7) {
        window.scrollTo({ top: Math.min(position, maximumScroll), behavior: "smooth" });
        await delay(700);
      }
      window.scrollTo({ top: maximumScroll, behavior: "smooth" });
      await delay(900);
      window.scrollTo({ top: 0, behavior: "smooth" });
      await delay(900);
    });
    await recorder.stop();

    await run("/usr/bin/ffmpeg", [
      "-y",
      "-i",
      temporaryVideoPath,
      "-an",
      "-c:v",
      "libvpx-vp9",
      "-crf",
      "32",
      "-b:v",
      "0",
      "-pix_fmt",
      "yuv420p",
      videoPath,
    ]);
    await fs.unlink(temporaryVideoPath);
  } finally {
    await browser.close();
  }
}
