const { AsyncDatabase } = require('promised-sqlite3');

function getSqliteDatetime() {
    const currentDate = new Date();
    return `${currentDate.getFullYear()}-${
        currentDate.getMonth() + 1
    }-${currentDate.getDay()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
}

async function populateTablesWithTestData(db_path) {
    let errors = [];

    const todos = [
        [
            'fix bugs',
            'fix bugs in your god damn code mate!',
            getSqliteDatetime(),
            getSqliteDatetime(),
            0,
        ],
        [
            'create documentation',
            'create documentation of the current electron project',
            getSqliteDatetime(),
            getSqliteDatetime(),
            1,
        ],
    ];

    const tags = [
        [1, 'python'],
        [1, 'bugfix'],
        [1, 'programming'],
        [2, 'javascript'],
        [2, 'nodejs'],
        [2, 'electron'],
    ];

    const todos_sql = `
        INSERT INTO todos (header, contents, date_created, date_modified, resolved) 
        VALUES (?, ?, ?, ?, ?)
    `;

    const tags_sql = `
        INSERT INTO tags (todo_id, name) 
        VALUES (?, ?)
    `;

    try {
        const db = await AsyncDatabase.open(db_path);

        let resp = await db.get('SELECT COUNT(*) AS count FROM todos');
        if (resp.count === 0) {
            todos.forEach(async (todo) => {
                await db.run(todos_sql, todo);
            });
        }

        resp = await db.get('SELECT COUNT(*) AS count FROM tags');
        if (resp.count === 0) {
            tags.forEach(async (tag) => {
                await db.run(tags_sql, tag);
            });
        }
    } catch (err) {
        errors.push(err);
    }

    return errors;
}

async function initDatabases(db_path) {
    let error = '';
    const create_todos = `
        CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            header TEXT,
            contents TEXT,
            date_created DATETIME,
            date_modified DATETIME,
            resolved INTEGER
        )
    `;

    const create_tags = `
        CREATE TABLE IF NOT EXISTS tags (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            todo_id INTEGER,
            name TEXT,
            FOREIGN KEY (todo_id) REFERENCES todos(id)
        )
    `;

    try {
        const db = await AsyncDatabase.open(db_path);
        await db.exec(create_todos);
        await db.exec(create_tags);
    } catch (err) {
        error = err;
    }
    return error;
}

async function getTodos(db_path) {
    let get_todos_sql = `SELECT * FROM todos`;
    let get_tags_sql = `SELECT * FROM tags`;
    let error = '';
    const result = {};

    try {
        const db = await AsyncDatabase.open(db_path);
        result.todos = await db.all(get_todos_sql);
        result.tags = await db.all(get_tags_sql);
    } catch (err) {
        error = err;
    }

    return {
        result,
        error,
    };
}

module.exports = { initDatabases, populateTablesWithTestData, getTodos };
