import {promises as fs} from 'fs';
import matter from 'gray-matter';
import {join} from 'path';

export async function getAllMDXFiles(dir: string): Promise<string[]> {
    try {
        const files = await fs.readdir(dir);
        const mdxFiles = files.filter(f => f.endsWith('.mdx') && !f.startsWith('_'));
        console.log('📄 Found MDX files:', mdxFiles);
        return mdxFiles;
    } catch (error) {
        console.error('❌ Error reading MDX files:', error);
        return [];
    }
}

export async function getMDXMetadata(dir: string, files: string[]) {
    const metadata = [];
    for (const file of files) {
        const filePath = join(dir, file);
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            const {data} = matter(content);
            metadata.push({...data, slug: file.replace('.mdx', '')});
        } catch (error) {
            console.error(`❌ Error parsing metadata from file ${file}:`, error);
        }
    }
    return metadata;
}
