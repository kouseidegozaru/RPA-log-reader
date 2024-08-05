import path from 'node:path';
import { BrowserWindow, app } from 'electron';

import  { readFileWithBOM } from './modules/load_log/read'

// 開発時には electron アプリをホットリロードする
if (process.env.NODE_ENV === "development") {
  require("electron-reload")(__dirname, {
    electron: path.resolve(
      __dirname,
      process.platform === "win32"
        ? "../node_modules/electron/dist/electron.exe"
        : "../node_modules/.bin/electron",
    ),
    forceHardReset: true,
    hardResetMethod: "exit",
  });
}

const createWindow = () =>  {
  // アプリの起動イベント発火で BrowserWindow インスタンスを作成
  const mainWindow = new BrowserWindow({
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

app.whenReady().then(() => {
  createWindow();

  (async () => {
    const filePath = 'log/866eaa97-a2cd-47e2-a923-703665370808/RunningLog.json'; // 読み取りたいファイルのパスを指定してください
    try {
      const fileContent = await readFileWithBOM(filePath);
      console.log('File Content:', fileContent);
    } catch (error) {
      console.error('Error reading file:', error);
    }
  })();

});

// すべてのウィンドウが閉じられたらアプリを終了する
app.once('window-all-closed', () => app.quit());