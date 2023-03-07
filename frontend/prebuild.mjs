import fs from 'fs';
import path from 'path';
import { globby } from 'globby';

console.log('Starting prebuild.mjs')
const extensionsDirectory = path.posix.join(
  process.cwd(),
  '../catalog/data-model-extensions'
);

const originPaths = await globby(extensionsDirectory, {
  expandDirectories: {
    files: ['schema.json'],
  },
});

await fs.rmSync('./public/schemas', { recursive: true, force: true });

await fs.mkdirSync('./public/schemas');

const destinyPaths = originPaths.map((path) => {
  const schemaIdentifiers = path.split('/').slice(-4, -1);
  return './public/schemas/' + schemaIdentifiers.join('-') + '.schema.json';
});

const originDestinyPairs = originPaths.map((origin, i) => [
  origin,
  destinyPaths[i],
]);

originDestinyPairs.forEach(async (pair) => {
  await fs.copyFileSync(pair[0], pair[1]);
});
