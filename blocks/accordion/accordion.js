import {
    createEl
} from '/scripts/scripts.js';

export default function decorate(block) {
    const titleEls = block.querySelectorAll('h3');
    for (const titleEl of titleEls) {
        const groupingEl = buildGrouping(titleEl);
        titleEl.after(groupingEl);
        titleEl.setAttribute('tabindex', 0);
        titleEl.addEventListener('click', () => {
            if (groupingEl.classList.contains('showing')) {
                groupingEl.classList.remove('showing');
                titleEl.classList.remove('showing');
            } else {
                groupingEl.classList.add('showing');
                titleEl.classList.add('showing');
            }
        });
    };
}

function buildGrouping(titleEl) {
    const groupingEl = createEl('div', {
        belongsTo: titleEl.id,
        class: 'grouping'
    }, '');
    while (true) {
        const pEl = titleEl.nextElementSibling;
        if (pEl?.tagName === 'P' || pEl?.tagName === 'UL') {
            groupingEl.append(pEl);
        } else {
            break;
        }
    }
    return groupingEl;
}