import fs from 'fs/promises';

// BOM付きファイルの読み取り
export async function readFileWithBOM(filePath: string): Promise<string> {
    const buffer = await fs.readFile(filePath);
    let data = buffer.toString('utf8');
    // UTF-8 BOMのチェックと削除
    if (data.charCodeAt(0) === 0xFEFF) {
      data = data.substring(1);
    }
    return data;
  }

// 独自フォーマットを標準JSONに変換する関数
export function convertToStandardJSON(data: string): JSON {
  return JSON.parse(data
    .replace(/</g, '{')
    .replace(/>/g, '}')
    .replace(/~"/g, '":')
    .replace(/~\{/g, ': {')
    .replace(/"\~/g, '": ')
    .replace(/::/g, ':'));
}

module.exports = { readFileWithBOM ,convertToStandardJSON};
  