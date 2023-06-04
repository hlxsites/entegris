import { getMetadata, decorateIcons } from '../../scripts/lib-franklin.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

export default async function decorate(block) {
  // fetch nav content
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta).pathname : '/nav';
  let resp = await fetch(`${navPath}.plain.html`);

  if (resp.ok) {
    const html = await resp.text();

    // decorate nav DOM
    const nav = document.createElement('nav');
    nav.id = 'nav';
    nav.innerHTML = html;

    const navWrapper = document.createElement('div');
    navWrapper.className = 'nav-wrapper';
    navWrapper.append(nav);
    block.append(navWrapper);

    const logo = nav.querySelector('.logo');
    const logoLink = logo.querySelector('a');
    const logoImagePath = logoLink.textContent;
    const logoImage = document.createElement('img');
    logoImage.src = logoImagePath;
    logoImage.alt = 'Logo';
    logoLink.replaceChildren(logoImage);

    block.append(logo);
  }

  // resp = await fetch('https://poco.entegris.com/content/microsite-live/poco-live/en/home/our-science/by-service/technical-support/_jcr_content/multitiernavigation.ssi.html/entegris/components/content/ux/multitiernavigation.html');
  // if(resp.ok) {
  //   const html = await resp.text();
  //   const main = document.querySelector('main');
  //   const navBar = document.createElement('section');
  //   navBar.innerHTML = html;
  //   main.append(navBar);
  // }
}

