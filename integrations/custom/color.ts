import sharp from 'sharp';
import {argbFromRgb, hexFromArgb, QuantizerCelebi, Score} from '@material/material-color-utilities';

/**
 * Extrait la source color Material You d'une image locale.
 * Même pipeline que sourceColorFromImage() du navigateur, mais en Node.js via sharp.
 */
export async function extractSourceColor(imagePath: string): Promise<string> {
    const {data, info} = await sharp(imagePath)
        .resize(112, 112, {fit: 'cover'})
        .raw()
        .ensureAlpha()
        .toBuffer({resolveWithObject: true});

    const pixels: number[] = [];
    const channels = info.channels; // 4 avec ensureAlpha
    for (let i = 0; i < data.length; i += channels) {
        if (data[i + 3] < 255) continue;
        pixels.push(argbFromRgb(data[i], data[i + 1], data[i + 2]));
    }

    const result = QuantizerCelebi.quantize(pixels, 128);
    const ranked = Score.score(result);
    return hexFromArgb(ranked[0]);
}
