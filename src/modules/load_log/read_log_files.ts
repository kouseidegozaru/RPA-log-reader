import fs from 'fs/promises';
import path from 'path';
import { RunningLog, ExceptionLog, JSONData } from './types';

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

// RunningLog 型のデータかどうかをチェックする型ガード関数
function isRunningLog(data: any): data is RunningLog {
    return data && typeof data.TID === 'string' && typeof data.IID === 'number' &&
           data.CT !== undefined && typeof data.CT.ScenarioPath === 'string';
}

// ExceptionLog 型のデータかどうかをチェックする型ガード関数
function isExceptionLog(data: any): data is ExceptionLog {
    return data && typeof data.TID === 'string' && typeof data.IID === 'number' &&
           data.CT !== undefined && data.CT.OccuredTime !== undefined;
}

// JSONデータを適切な型に変換する関数
export async function convertToJSONData(jsonFileContent: JSON): Promise<{ fileType: string; content: JSONData }> {

    if (isRunningLog(jsonFileContent)) {
        return { fileType: 'RunningLog', content: jsonFileContent };
    } else if (isExceptionLog(jsonFileContent)) {
        return { fileType: 'ExceptionLog', content: jsonFileContent };
    } else {
        throw new Error('Unsupported JSON format');
    }
}
