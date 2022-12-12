import fs from 'fs';
import path from 'path';
import { globby } from 'globby';
import { info } from 'console';

const extensionsDirectory = path.posix.join(process.cwd(), '../catalog/data-model-extensions');

export async function getAllExtensionsData() {

  const paths = await globby(extensionsDirectory, {
    expandDirectories: {
      files: ['package.json']
    }
  });

  const allExtensionsData = paths.map((path) => {
    const packageContent = fs.readFileSync(path, 'utf8');

    const extension = JSON.parse(packageContent);

    const author = extension.author;
    const name = extension.name;
    const version = extension.version;
    const description = extension.description;
    const status = extension["catalog-info"].status;

    return {
      author,
      name,
      version,
      description,
      status
    };
  });

  return allExtensionsData;
}
