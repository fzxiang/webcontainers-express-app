import path from 'node:path';
import fs from 'node:fs';

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
