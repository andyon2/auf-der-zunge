import { defineConfig, type Plugin } from 'vite';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

// Writes dist/sw.js from src/sw.js with the list of built files and a cache name from their content.
function serviceWorker(): Plugin {
  return {
    name: 'service-worker',
    apply: 'build',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const names = Object.keys(bundle).sort();
      const hash = createHash('sha256');
      for (const name of names) {
        const file = bundle[name];
        hash.update(name).update(file.type === 'chunk' ? file.code : file.source);
      }
      const files = ['./', ...names.map(name => `./${name}`)];
      const source = readFileSync('src/sw.js', 'utf8')
        .replace('__VERSION__', hash.digest('hex').slice(0, 12))
        .replace('__FILES__', JSON.stringify(files));
      this.emitFile({ type: 'asset', fileName: 'sw.js', source });
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [serviceWorker()],
});
