import {
    getIndex,
    getBasePath
} from '/scripts/scripts.js';

export default async function decorate(block) {
    const index = await getIndex();
    const links = block.querySelectorAll('a');
    links.forEach(link => {
        const parentNode = link.parentNode;
        if(parentNode.nodeName !== 'P') {
            const p = document.createElement('p');
            p.appendChild(link);
            parentNode.replaceChildren(p);
        }
        const basePath = getBasePath(link.title);
        const entry = index?.getEntry(basePath);
        if (entry) {
            const title = document.createElement('h3');
            title.textContent = entry.title;
            const desc = document.createElement('p');
            desc.textContent = entry.description;
            link.replaceChildren(title, desc);
        }
    })
}