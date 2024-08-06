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
        if (item.isDirectory()) {
            // ディレクトリの場合は再帰的に処理
            const subDirFilePaths = await getFilePaths(fullPath);
            filePaths = filePaths.concat(subDirFilePaths);
        }
        else if (item.isFile()) {
            // ファイルの場合はパスを追加
            filePaths.push(fullPath);
        }
    }
    return filePaths;
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
// JSONデータを適切な型に変換する関数
async function convertToJSONData(jsonFileContent) {
    if (isRunningLog(jsonFileContent)) {
        return { fileType: 'RunningLog', content: jsonFileContent };
    }
    else if (isExceptionLog(jsonFileContent)) {
        return { fileType: 'ExceptionLog', content: jsonFileContent };
    }
    else {
        throw new Error('Unsupported JSON format');
    }
}
// すべてのログファイルを読み取る関数
async function readAllLogFiles(dirPath) {
    const logData = [];
    try {
        const filepaths = await getFilePaths(dirPath);
        for (const filePath of filepaths) {
            try {
                const jsonContent = await (0, read_json_file_1.readJsonFile)(filePath);
                const jsonData = await convertToJSONData(jsonContent);
                logData.push({ fileType: jsonData.fileType, content: jsonData.content });
            }
            catch (error) {
                console.error(`Error converting file ${filePath}:`, error);
            }
        }
    }
    catch (error) {
        console.error('Error reading log files:', error);
    }
    return logData;
}
