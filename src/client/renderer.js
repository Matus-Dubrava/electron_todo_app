const init = async () => {
    const response = await window.data.getTodos();
    await getVersion();
    renderData(response);
};

function renderData(response) {
    const tbody = document.getElementById('todo-form-table-body');
    if (!response.error) {
        for (let todo of response.result.todos) {
            const tr = document.createElement('tr');
            const headerEl = document.createElement('td');
            const contentsEl = document.createElement('td');
            const dateCreatedEl = document.createElement('td');
            const dateModifiedEl = document.createElement('td');
            const resolvedEl = document.createElement('td');

            headerEl.innerText = todo.header;
            contentsEl.innerText = todo.contents;
            dateCreatedEl.innerText = todo.date_created;
            dateModifiedEl.innerText = todo.date_modified;
            resolvedEl.innerText = todo.resolved === 1 ? true : false;

            tr.appendChild(headerEl);
            tr.appendChild(contentsEl);
            tr.appendChild(dateCreatedEl);
            tr.appendChild(dateModifiedEl);
            tr.appendChild(resolvedEl);
            tbody.appendChild(tr);
        }
    } else {
        console.error(response.error);
    }
}

async function getVersion() {
    const version = await window.data.getVersion();
    const versionEl = document.getElementById('version');
    versionEl.textContent = version;
}

const root = document.getElementById('main');

init();
