import fs from 'fs/promises';
import path from 'path';
import { RunningLog, ExceptionLog } from './log_types';
import { readJsonFile } from './read_json_file';

// ディレクトリパスからその下の全てのファイルパスの取得
async function getFilePaths(dirPath: string): Promise<string[]> {
    let filePaths: string[] = [];

    // ディレクトリ内のアイテムを読み取る
    const items = await fs.readdir(dirPath, { withFileTypes: true });

    // 各アイテムについて処理
    for (const item of items) {
        const fullPath = path.join(dirPath, item.name);
        if (item.isFile()) {
            // ファイルの場合はパスを追加
            filePaths.push(fullPath);
        }
    }
    return filePaths;
}
// ディレクトリパスからその下の全てのファイルパスの取得
async function getFileDirs(dirPath: string): Promise<string[]> {
    let fileDirs: string[] = [];

    // ディレクトリ内のアイテムを読み取る
    const items = await fs.readdir(dirPath, { withFileTypes: true });

    // 各アイテムについて処理
    for (const item of items) {
        const fullPath = path.join(dirPath, item.name);
        if (item.isDirectory()) {
            // ディレクトリの場合
            fileDirs.push(fullPath);
        }
    }

    return fileDirs;
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

// すべてのログファイルを読み取る関数
export async function readAllLogFiles(dirPath: string): Promise<RunningLog []> {
    const logData: RunningLog [] = [];
    const fileDirs = await getFileDirs(dirPath);

    for (const fileDir of fileDirs) {
        const filePaths = await getFilePaths(fileDir);
        let runningLogContent: RunningLog | undefined;
        let exceptionLogContent: ExceptionLog | undefined;
        
        for (const filePath of filePaths) {
            const jsonContent = await readJsonFile(filePath);

            if (isRunningLog(jsonContent)) {
                runningLogContent = jsonContent;
            } else if (isExceptionLog(jsonContent)) {
                exceptionLogContent = jsonContent;
            }
        }

        if (runningLogContent) {
            if(exceptionLogContent){
                runningLogContent.error = exceptionLogContent;
            }
            logData.push(runningLogContent);
        }
        
    }

    return logData;
}
