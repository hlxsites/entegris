import {
  readBlockConfig,
  decorateIcons
} from '../../scripts/lib-franklin.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  // fetch footer content
  const footerPath = cfg.footer || '/footer';
  const resp = await fetch(`${footerPath}.plain.html`, window.location.pathname.endsWith('/footer') ? { cache: 'reload' } : {});

  if (resp.ok) {
    const html = await resp.text();

    // decorate footer DOM
    const footer = document.createElement('div');
    footer.innerHTML = html;

    const logo = footer.querySelector('.logo');
    const logoLink = logo.querySelector('a');
    const logoImagePath = logoLink.textContent;
    const logoImage = document.createElement('img');
    logoImage.src = logoImagePath;
    logoImage.alt = 'Logo';
    logoLink.replaceChildren(logoImage);

    const socials = footer.querySelectorAll('.social a');
    socials.forEach(a => {
      let iconName;
      for (const c of a.querySelector('span')?.classList) {
        if (c.includes('-')) {
          iconName = c.substring(c.indexOf('-') + 1);
        }
      }
      a.setAttribute('aria-label', iconName);
    });

    decorateIcons(footer);
    block.append(footer);
  }
}
