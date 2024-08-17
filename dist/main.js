"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const electron_1 = require("electron");
const read_log_files_1 = require("./modules/load_log/read_log_files");
// 開発時には electron アプリをホットリロードする
if (process.env.NODE_ENV === "development") {
    require("electron-reload")(__dirname, {
        electron: node_path_1.default.resolve(__dirname, process.platform === "win32"
            ? "../node_modules/electron/dist/electron.exe"
            : "../node_modules/.bin/electron"),
        forceHardReset: true,
        hardResetMethod: "exit",
    });
}
const createWindow = () => {
    // アプリの起動イベント発火で BrowserWindow インスタンスを作成
    const mainWindow = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        title: 'RPAログ解析',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: node_path_1.default.join(__dirname, 'preload.js'),
        },
    });
    // 開発時にはデベロッパーツールを開く
    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools({ mode: 'detach' });
    }
    // レンダラープロセスをロード
    mainWindow.loadFile('dist/index.html');
};
const tests = async () => {
    const fileDir = 'log'; // 読み取りたいファイルのパスを指定してください
    try {
        const logData = await (0, read_log_files_1.readAllLogFiles)(fileDir);
        for (const log of logData) {
            console.log(await log);
            console.log('----------------------------------');
        }
    }
    catch (error) {
        console.error('Error reading file:', error);
    }
};
electron_1.app.whenReady().then(() => {
    createWindow();
    tests();
});
// すべてのウィンドウが閉じられたらアプリを終了する
electron_1.app.once('window-all-closed', () => electron_1.app.quit());
