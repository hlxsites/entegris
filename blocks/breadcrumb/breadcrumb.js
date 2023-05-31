import {
    getIndex
} from '/scripts/scripts.js';

export default async function decorate(block) {
    const index = await getIndex();
    const host = window.location.protocol + "//" + window.location.host;
    let currentPath = window.location.pathname;
    while (currentPath && currentPath !== '/en/home') {
        const entry = index?.getEntry(currentPath);
        const title = entry?.title || currentPath.substring(currentPath.lastIndexOf('/') + 1);
        createLinkElement(title, currentPath);
        currentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
    }
    createLinkElement('Home', currentPath); // Add the last one 

    function createLinkElement(title, currentPath) {
        const link = document.createElement('a');
        link.href = host + currentPath;
        link.textContent = title;
        block.appendChild(link);
    }
}

