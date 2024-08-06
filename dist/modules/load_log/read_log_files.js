"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilePaths = getFilePaths;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
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
