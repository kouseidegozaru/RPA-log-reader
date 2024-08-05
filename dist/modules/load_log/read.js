"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFileWithBOM = readFileWithBOM;
const promises_1 = __importDefault(require("fs/promises"));
// BOM付きファイルの読み取り
async function readFileWithBOM(filePath) {
    const buffer = await promises_1.default.readFile(filePath);
    let data = buffer.toString('utf8');
    // UTF-8 BOMのチェックと削除
    if (data.charCodeAt(0) === 0xFEFF) {
        data = data.substring(1);
    }
    return data;
}
module.exports = { readFileWithBOM };
