import ffmpeg from 'fluent-ffmpeg';
import path from 'node:path';

export function createVideoOptimizer(output: string, inputPath: string) {
    return ffmpeg(inputPath)
        .videoCodec('libvpx-vp9')
        .noAudio()
        .format('webm')
        .fps(30)
        .addOption('-crf', '28')
        .addOption('-b:v', '1M')
        .addOption('-maxrate', '4M')
        .addOption('-bufsize', '2M')
        .addOption('-pix_fmt', 'yuv420p')
        .addOption('-preset', 'slower')
        .on('end', () => console.log(`✅ Optimization complete: ${output}`))
        .on('error', (err) => console.error(`❌ Optimization error: ${output}`, err))
        .output(output);
}

export async function extractFirstFrameAsWebP(
    videoPath: string,
    outputImagePath: string,
    imageName = 'frame_%d',
): Promise<void> {
    return new Promise((resolve, reject) => {
        ffmpeg(videoPath)
            .on('start', () => console.log(`📹 Extracting frame from ${videoPath}`))
            .on('end', () => {
                console.log(`✅ Frame saved: ${outputImagePath}`);
                resolve();
            })
            .on('error', (err) => {
                console.error(`❌ Frame extraction error:`, err);
                reject(err);
            })
            .screenshots({
                timestamps: ['00:00:00.000'],
                filename: imageName + '.webp',
                folder: path.dirname(outputImagePath),
                size: '1440x900',
            })
            .toFormat('webp');
    });
}
