const { BrowserWindow, ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('data', {
    getTodos: () => ipcRenderer.invoke('getTodos'),
});

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector);
        if (element) {
            element.innerText = text;
        }
    };

    for (const dependecy of ['chrome', 'node', 'electron']) {
        replaceText(`${dependecy}-version`, process.versions[dependecy]);
        console.log(process);
        console.log(process.something);
    }
});
