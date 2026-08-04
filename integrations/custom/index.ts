import type {AstroIntegration} from 'astro';
import {promises as fs} from 'fs';
import matter from 'gray-matter';
import {join} from 'path';
import {loadEnv} from 'vite';

import {getAllMDXFiles, getMDXMetadata} from './mdx';
import {recordPageScrollWithAnimations} from './screenshot';
import {createVideoOptimizer, extractFirstFrameAsWebP} from './video';
import {generateBackgroundMockup} from './background';
import {extractSourceColor} from './color';

export default function customIntegration(): AstroIntegration {
    return {
        name: 'astro-custom-integration',
        hooks: {
            'astro:config:setup': async ({logger}) => {
                // loadEnv charge le .env avant que Vite l'injecte dans process.env
                const env = loadEnv('', process.cwd(), '');
                const openrouterApiKey = env.OPENROUTER_API_KEY;

                const realisationsDir = join('src', 'data', 'realisation');
                const mdxFiles = await getAllMDXFiles(realisationsDir);
                const realisationsData: any[] = await getMDXMetadata(realisationsDir, mdxFiles);

                // ── Pass 1 : Video recording & optimization ────────────────────────────
                const validRealisations = realisationsData.filter(({website}) => website);
                logger.info(`🎬 Starting video processing for ${validRealisations.length} projects`);

                for (const [index, {website: url, slug}] of validRealisations.entries()) {
                    logger.info(`\n📊 Processing ${index + 1}/${validRealisations.length}: ${slug}`);

                    const videoPath     = join('public', 'videos', 'renders', `${slug}.mp4`);
                    const maltVideoPath = join('public', 'videos', 'renders', `${slug}-malt.mp4`);

                    // Standard 1080p
                    try {
                        await fs.access(videoPath);
                        logger.info(`✅ Standard video exists: ${slug}`);
                    } catch {
                        logger.info(`🎬 Recording standard video (1920x1080): ${slug}`);
                        await recordPageScrollWithAnimations(url, videoPath, 1080);
                        logger.info(`✅ Standard recording complete: ${slug}`);

                        extractFirstFrameAsWebP(videoPath, `./src/assets/renders/${slug}.webp`, slug)
                            .catch(err => console.error(`❌ Thumbnail error: ${slug}`, err));

                        createVideoOptimizer(videoPath.replace('.mp4', '-720.webm'), videoPath).size('1280x720').run();
                        createVideoOptimizer(videoPath.replace('.mp4', '-480.webm'), videoPath).size('720x480').run();
                    }

                    // Malt 1380p
                    try {
                        await fs.access(maltVideoPath);
                        logger.info(`✅ Malt video exists: ${slug}`);
                    } catch {
                        logger.info(`🎬 Recording Malt video (1920x1380): ${slug}`);
                        await recordPageScrollWithAnimations(url, maltVideoPath, 1380);
                        logger.info(`✅ Malt recording complete: ${slug}`);

                        createVideoOptimizer(maltVideoPath.replace('.mp4', '-malt.webm'), maltVideoPath)
                            .size('1920x1380')
                            .screenshots({
                                timestamps: ['00:00:00.000'],
                                filename: `${slug}-malt.webp`,
                                folder: './src/assets/renders',
                                size: '522x375',
                            })
                            .run();
                    }

                    const remaining = validRealisations.length - (index + 1);
                    if (remaining > 0) logger.info(`⏳ ${remaining} projects remaining`);
                }
                logger.info(`🎉 All video processing complete!`);

                // ── Pass 2 : Background mockup generation (OpenRouter) ─────────────────
                logger.info(`🖼️  Checking for missing background images...`);

                for (const file of mdxFiles) {
                    const filePath         = join(realisationsDir, file);
                    const slug             = file.replace('.mdx', '');
                    const content          = await fs.readFile(filePath, 'utf-8');
                    const parsed           = matter(content);
                    const newBackgroundPath = join('src', 'assets', 'backgrounds', `${slug}-background.webp`);

                    // Vérifie l'existence du fichier dans src/assets/backgrounds/ (nouvelle localisation)
                    const expectedRelPath = `../../assets/backgrounds/${slug}-background.webp`;
                    try {
                        await fs.access(newBackgroundPath);
                        // Fichier présent — s'assure que le MDX référence bien le chemin relatif correct
                        if (parsed.data.images?.background?.src !== expectedRelPath) {
                            logger.info(`🔄 Migrating background path for ${slug}...`);
                            parsed.data.images = {
                                ...parsed.data.images,
                                background: {
                                    src: expectedRelPath,
                                    alt: parsed.data.images?.background?.alt ?? "",
                                    sourceColor: parsed.data.images?.background?.sourceColor,
                                },
                            };
                            await fs.writeFile(filePath, matter.stringify(parsed.content, parsed.data), 'utf-8');
                        } else {
                            logger.info(`✅ Background already generated: ${slug}`);
                        }
                        continue;
                    } catch { /* pas encore généré */ }

                    if (!parsed.data.title || !parsed.data.description) {
                        logger.warn(`⚠️  Skipping ${slug} — frontmatter incomplete (title/description missing, check YAML indentation)`);
                        continue;
                    }

                    logger.info(`🖼️  No background for ${slug} — generating mockup via OpenRouter...`);

                    try {
                        const backgroundSrc = await generateBackgroundMockup({
                            slug,
                            title:       parsed.data.title,
                            description: parsed.data.description,
                            themeSource: parsed.data.theme?.source ?? '#000000',
                            isDark:      parsed.data.theme?.isDark ?? false,
                            renderPath:  join('src', 'assets', 'renders', `${slug}.webp`),
                            logoSrc:     parsed.data.images?.logo?.src,
                            apiKey:      openrouterApiKey,
                        });

                        if (backgroundSrc) {
                            parsed.data.images = {
                                ...parsed.data.images,
                                background: {
                                    src: backgroundSrc.src,  // chemin relatif ../../assets/backgrounds/...
                                    alt: backgroundSrc.alt,
                                },
                            };
                            await fs.writeFile(filePath, matter.stringify(parsed.content, parsed.data), 'utf-8');
                            logger.info(`✅ Background set for ${slug}: ${backgroundSrc.src}`);
                        }
                    } catch (err) {
                        logger.error(`❌ Background generation failed for ${slug}: ${err}`);
                    }
                }
                logger.info(`🖼️  Background generation pass complete!`);

                // ── Pass 3 : Material You source color extraction ──────────────────────
                logger.info(`🎨 Extracting source colors from project images...`);

                for (const file of mdxFiles) {
                    const filePath         = join(realisationsDir, file);
                    const slug             = file.replace('.mdx', '');
                    const content          = await fs.readFile(filePath, 'utf-8');
                    const parsed           = matter(content);
                    const backgroundFilePath = join('src', 'assets', 'backgrounds', `${slug}-background.webp`);

                    try {
                        await fs.access(backgroundFilePath);
                    } catch {
                        logger.warn(`⚠️  No background at new location for ${slug}, skipping color extraction`);
                        continue;
                    }

                    if (parsed.data.images?.background?.sourceColor) {
                        logger.info(`✅ sourceColor already set for ${slug}: ${parsed.data.images.background.sourceColor}`);
                        continue;
                    }

                    try {
                        const hex = await extractSourceColor(backgroundFilePath);
                        parsed.data.images = {
                            ...parsed.data.images,
                            background: {...parsed.data.images.background, sourceColor: hex},
                        };
                        await fs.writeFile(filePath, matter.stringify(parsed.content, parsed.data), 'utf-8');
                        logger.info(`🎨 Set sourceColor for ${slug}: ${hex}`);
                    } catch (err) {
                        logger.error(`❌ Color extraction failed for ${slug}: ${err}`);
                    }
                }
                logger.info(`🎨 Source color extraction complete!`);
            },
        },
    };
}
