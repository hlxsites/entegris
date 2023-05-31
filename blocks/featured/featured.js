export default function decorate(block) {
    const p = block.querySelector('p')
    const pdfIcon = document.createElement('img');
    pdfIcon.src = 'https://poco.entegris.com/content/dam/web/ux/global/pdf-icon';
    p.append(pdfIcon);
}