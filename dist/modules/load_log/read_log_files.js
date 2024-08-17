"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readAllLogFiles = readAllLogFiles;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const read_json_file_1 = require("./read_json_file");
// ディレクトリパスからその下の全てのファイルパスの取得
async function getFilePaths(dirPath) {
    let filePaths = [];
    // ディレクトリ内のアイテムを読み取る
    const items = await promises_1.default.readdir(dirPath, { withFileTypes: true });
    // 各アイテムについて処理
    for (const item of items) {
        const fullPath = path_1.default.join(dirPath, item.name);
        if (item.isFile()) {
            // ファイルの場合はパスを追加
            filePaths.push(fullPath);
        }
    }
    return filePaths;
}
// ディレクトリパスからその下の全てのファイルパスの取得
async function getFileDirs(dirPath) {
    let fileDirs = [];
    // ディレクトリ内のアイテムを読み取る
    const items = await promises_1.default.readdir(dirPath, { withFileTypes: true });
    // 各アイテムについて処理
    for (const item of items) {
        const fullPath = path_1.default.join(dirPath, item.name);
        if (item.isDirectory()) {
            // ディレクトリの場合
            fileDirs.push(fullPath);
        }
    }
    return fileDirs;
}
// RunningLog 型のデータかどうかをチェックする型ガード関数
function isRunningLog(data) {
    return data && typeof data.TID === 'string' && typeof data.IID === 'number' &&
        data.CT !== undefined && typeof data.CT.ScenarioPath === 'string';
}
// ExceptionLog 型のデータかどうかをチェックする型ガード関数
function isExceptionLog(data) {
    return data && typeof data.TID === 'string' && typeof data.IID === 'number' &&
        data.CT !== undefined && data.CT.OccuredTime !== undefined;
}
// すべてのログファイルを読み取る関数
async function readAllLogFiles(dirPath) {
    const logData = [];
    const fileDirs = await getFileDirs(dirPath);
    for (const fileDir of fileDirs) {
        const filePaths = await getFilePaths(fileDir);
        let runningLogContent;
        let exceptionLogContent;
        for (const filePath of filePaths) {
            const jsonContent = await (0, read_json_file_1.readJsonFile)(filePath);
            if (isRunningLog(jsonContent)) {
                runningLogContent = jsonContent;
            }
            else if (isExceptionLog(jsonContent)) {
                exceptionLogContent = jsonContent;
            }
        }
        if (runningLogContent) {
            if (exceptionLogContent) {
                runningLogContent.error = exceptionLogContent;
            }
            logData.push(runningLogContent);
        }
    }
    return logData;
}
