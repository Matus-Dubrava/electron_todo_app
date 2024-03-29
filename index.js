const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs').promises;
const path = require('node:path');
const { promisify } = require('util');
const { exec } = require('child_process');
const execAsync = promisify(exec);
const {
    initDatabases,
    populateTablesWithTestData,
    getTodos,
} = require('./src/app/utils');
const {
    currentEnvironment,
    Environment,
    DATA_FOLDER_PATH,
    DB_PATH,
    INSTALLATION_PATH,
} = require('./config');

async function getVersion() {
    let error = '';
    let version = '';

    let cmd = '';
    if (currentEnvironment === Environment.DEV) {
        cmd = 'python3 cli.py';
    } else {
        cmd = `${INSTALLATION_PATH}/cli`;
    }

    try {
        const { stdout, stderr } = await execAsync(cmd);
        if (stderr) {
            error = stderr;
        } else {
            version = stdout;
        }
    } catch (err) {
        error = err;
    }
    return { version, error };
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
    let { error, version } = await getVersion();
    if (error) {
        console.error('error while fetching version');
        console.error(error);
        exit(1);
    } else {
        console.log(`build version: ${version}`);
    }

    console.log(`running in '${currentEnvironment}' environment...`);

    error = await intializeDirs();
    if (error) {
        console.error(`failed to create folder: ${DATA_FOLDER_PATH}`);
        console.error(error);
        process.exit(1);
    } else {
        console.log(`using data folder ${DATA_FOLDER_PATH}`);
    }

    error = await initDatabases(DB_PATH);
    if (error) {
        console.error(`opening: ${DB_PATH}`);
        console.error(error);
        process.exit(1);
    }

    if (currentEnvironment !== Environment.PROD) {
        const errors = await populateTablesWithTestData(DB_PATH);
        if (errors.length) {
            console.error(`opening: ${DB_PATH}`);
            console.error(errors);
            process.exit(1);
        }
    }

    ipcMain.handle('getTodos', async () => await getTodos(DB_PATH));
    ipcMain.handle('getVersion', () => version);

    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
