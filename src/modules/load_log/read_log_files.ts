import fs from 'fs/promises';
import path from 'path';

// ディレクトリパスからその下の全てのファイルパスの取得
export async function getFilePaths(dirPath: string): Promise<string[]> {
    let filePaths: string[] = [];

    // ディレクトリ内のアイテムを読み取る
    const items = await fs.readdir(dirPath, { withFileTypes: true });

    // 各アイテムについて処理
    for (const item of items) {
        const fullPath = path.join(dirPath, item.name);
        if (item.isDirectory()) {
        // ディレクトリの場合は再帰的に処理
        const subDirFilePaths = await getFilePaths(fullPath);
        filePaths = filePaths.concat(subDirFilePaths);
        } else if (item.isFile()) {
        // ファイルの場合はパスを追加
        filePaths.push(fullPath);
        }
    }

  return filePaths;
}
