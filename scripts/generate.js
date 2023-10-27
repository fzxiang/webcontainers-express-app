import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'url';

const { dirname } = path
const __filename = fileURLToPath(import.meta.url);
const projectPath = path.join(dirname(__filename), '../');

export async function buildFileSystemTree(dir) {
    const result = {};
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            result[file] = {
                directory: await buildFileSystemTree(filePath)
            };
        } else if (stat.isFile()) {
            result[file] = {
                file: {
                    contents: fs.readFileSync(filePath, 'utf8')
                }
            };
        }
    }

    return result;
}

// get the command line argument
let directoryPath = process.argv[2];

if (!directoryPath) {
  throw new Error('process.argv[2] is required');
} else {
  const dir =  path.join(projectPath, directoryPath)
  buildFileSystemTree(dir).then(tree => {
    let data = JSON.stringify(tree, null, 4); 
    fs.writeFileSync(path.join(projectPath, 'files.json'), data);
});
}

