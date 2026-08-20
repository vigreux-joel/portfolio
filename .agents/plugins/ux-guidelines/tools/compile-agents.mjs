// tools/compile-agents.mjs
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFrontmatter } from './frontmatter.mjs';

export function compileAgent(src) {
  const { data, body } = parseFrontmatter(src);
  if (!data.name) throw new Error('Agent sans champ "name".');
  if (!data.description) throw new Error(`Agent ${data.name} sans "description".`);
  return {
    name: data.name,
    description: data.description,
    hidden: data.hidden === true,
    config: {
      customAgent: {
        systemPromptSections: [{ title: 'Agent System Instructions', content: body }],
        toolNames: Array.isArray(data.tools) ? data.tools : [],
        systemPromptConfig: {
          includeSections: Array.isArray(data.includeSections) ? data.includeSections : [],
        },
      },
    },
  };
}

// Compile tout le dossier agents/<src> vers <dest>/agents/<name>/agent.json
export function compileAll(srcDir, destAgentsDir) {
  const files = readdirSync(srcDir).filter((f) => f.endsWith('.md'));
  const compiled = [];
  for (const file of files) {
    const json = compileAgent(readFileSync(join(srcDir, file), 'utf8'));
    const outDir = join(destAgentsDir, json.name);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, 'agent.json'), JSON.stringify(json, null, 2) + '\n');
    compiled.push(json.name);
  }
  return compiled;
}

// Exécution directe : node compile-agents.mjs <srcDir> <destAgentsDir>
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [srcDir, destAgentsDir] = process.argv.slice(2);
  const names = compileAll(srcDir, destAgentsDir);
  console.log(`Compilé ${names.length} agents : ${names.join(', ')}`);
}
