const path = require('node:path');
const os = require('os');

const Environment = {
    PROD: 'PROD',
    DEV: 'DEV',
};

const currentEnvironment = Environment.DEV;
let DATA_FOLDER_PATH = '';
let DB_PATH = '';
const INSTALLATION_PATH = path.join(os.homedir(), 'apps', 'todo_app');

if (currentEnvironment !== Environment.PROD) {
    DATA_FOLDER_PATH = path.join(__dirname, 'data');
    DB_PATH = path.join(DATA_FOLDER_PATH, 'todos.db');
} else {
    DATA_FOLDER_PATH = path.join(os.homedir(), '.data', 'todo_app');
    DB_PATH = path.join(DATA_FOLDER_PATH, 'todos.db');
}

module.exports = {
    Environment,
    currentEnvironment,
    DATA_FOLDER_PATH,
    DB_PATH,
    INSTALLATION_PATH,
};
