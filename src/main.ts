import path from 'node:path';
import { BrowserWindow, app } from 'electron';
import { readJsonFile } from './modules/load_log/read_json_file';
import { getFilePaths } from './modules/load_log/read_log_files';

// 開発時には electron アプリをホットリロードする
if (process.env.NODE_ENV === "development") {
  require("electron-reload")(__dirname, {
    electron: path.resolve(
      __dirname,
      process.platform === "win32"
        ? "../node_modules/electron/dist/electron.exe"
        : "../node_modules/.bin/electron"
    ),
    forceHardReset: true,
    hardResetMethod: "exit",
  });
}

const createWindow = () => {
  // アプリの起動イベント発火で BrowserWindow インスタンスを作成
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'RPAログ解析',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
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
    const filepaths = await getFilePaths(fileDir);
    console.log('File Content:', filepaths);
  } catch (error) {
    console.error('Error reading file:', error);
  }
};

app.whenReady().then(() => {
  createWindow();
  tests();
});

// すべてのウィンドウが閉じられたらアプリを終了する
app.once('window-all-closed', () => app.quit());