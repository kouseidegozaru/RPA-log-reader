import path from 'node:path';
import { BrowserWindow, app } from 'electron';

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

  // レンダラープロセスをロード
  mainWindow.loadFile('dist/index.html');
};

app.whenReady().then(() => {
  createWindow();
});

// すべてのウィンドウが閉じられたらアプリを終了する
app.once('window-all-closed', () => app.quit());