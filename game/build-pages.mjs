import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const dist = new URL('./dist/', import.meta.url);
const readAsset = path => readFileSync(new URL(path.replace(/^\//, ''), dist), 'utf8');
const template = readAsset('index.html');
const script = /<script type="module" crossorigin src="([^"]+)"><\/script>/;
const stylesheet = /<link rel="stylesheet" crossorigin href="([^"]+)">/;
if (!script.test(template) || !stylesheet.test(template)) {
  throw new Error('The Vite build is missing its script or stylesheet.');
}
const page = template
  .replace(script, (_, path) => '<script type="module">' +
    readAsset(path).replace(/<\/script/gi, '<\\/script') + '</script>')
  .replace(stylesheet, (_, path) => '<style>' + readAsset(path) + '</style>');
writeFileSync(resolve(process.argv[2] ?? '../index.html'), page);
