import {
    createEl
} from '/scripts/scripts.js';

export default function decorate(block) {
    const titleEls = block.querySelectorAll('h3');
    titleEls.forEach(titleEl => {
        buildGrouping(titleEl)
    });
}

function buildGrouping(titleEl) {
    console.log(titleEl)
}