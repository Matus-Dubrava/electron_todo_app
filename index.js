const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs').promises;
const path = require('node:path');
const os = require('os');
const {
    initDatabases,
    populateTablesWithTestData,
    getTodos,
} = require('./src/app/utils');

const environment = 'dev';
console.log(`runing in environment: ${environment}...`);

let DATA_FOLDER_PATH = '';
let DB_PATH = '';

if (environment !== 'prod') {
    DATA_FOLDER_PATH = path.join(__dirname, 'data');
    DB_PATH = path.join(DATA_FOLDER_PATH, 'todos.db');
} else {
    DATA_FOLDER_PATH = path.join(os.homedir(), '.data', 'todo_app');
    DB_PATH = path.join(DATA_FOLDER_PATH, 'todos.db');
}

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    win.loadFile('index.html');
}

async function intializeDirs() {
    let error = '';
    try {
        await fs.mkdir(DATA_FOLDER_PATH, { recursive: true });
    } catch (err) {
        error = err;
    }
    return error;
}

app.whenReady().then(async () => {
    let error = await intializeDirs();
    if (error) {
        console.error(`failed to create folder: ${DATA_FOLDER_PATH}`);
        console.error(error);
        process.exit(1);
    } else {
        console.log(`created data folder ${DATA_FOLDER_PATH}`);
    }

    error = await initDatabases(DB_PATH);
    if (error) {
        console.error(`opening: ${DB_PATH}`);
        console.error(error);
        process.exit(1);
    }
    const errors = await populateTablesWithTestData(DB_PATH);
    if (errors.length) {
        console.error(`opening: ${DB_PATH}`);
        console.error(errors);
        process.exit(1);
    }

    ipcMain.handle('getTodos', async () => await getTodos(DB_PATH));

    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
