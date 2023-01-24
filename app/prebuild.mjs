import fs from 'fs';
import path from 'path';
import { globby } from 'globby';

const extensionsDirectory = path.posix.join(
  process.cwd(),
  '../catalog/data-model-extensions'
);

const originPaths = await globby(extensionsDirectory, {
  expandDirectories: {
    files: ['schema.json'],
  },
});

fs.mkdir('./public/schemas', () => {
  console.log('created schemas directory');
});

const destinyPaths = originPaths.map((path) => {
  const schemaIdentifiers = path.split('/').slice(-4, -1);
  return './public/schemas/' + schemaIdentifiers.join('-') + '.schema.json';
});

const originDestinyPairs = originPaths.map((origin, i) => [
  origin,
  destinyPaths[i],
]);

originDestinyPairs.forEach((pair) => {
  fs.copyFile(pair[0], pair[1], () => {
    console.log(`copied ${pair}`);
  });
});
