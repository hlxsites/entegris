import {
    createEl
} from "/scripts/scripts.js";

export default async function decorate(block) {
    const linksHeaders = document.querySelectorAll('.links h2');
    console.log(linksHeaders)


    linksHeaders.forEach(header => {
        const hashId = header.id;
        const title = header.textContent;

        createEl('a', {
            href: `#${hashId}`
        }, title, block);
    })
}