import {
  sampleRUM,
  buildBlock,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
} from './lib-franklin.js';

const isDesktop = window.matchMedia('(min-width: 900px)').matches;

const LCP_BLOCKS = []; // add your LCP blocks to the list

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const section = document.createElement('div');
  const h1 = main.querySelector('h1');
  const picture1 = main.querySelector('picture');
  if (picture1) {
    picture1.classList.add('hero-picture');
    const picture2 = picture1.nextElementSibling;
    if (picture2 && picture2.tagName === 'PICTURE') {
      picture2.classList.add('hero-picture');
      if (h1 &&
        (h1.compareDocumentPosition(picture1) & Node.DOCUMENT_POSITION_PRECEDING)) {
        // Squareness is determined by how close to 0 the value is. The lower the value, the more square...
        const image1 = picture1.querySelector('img');
        const width1 = Math.max(image1.height, image1.width); // Making sure we're always using the same ratios
        const height1 = Math.min(image1.height, image1.width);
        const squareness1 = Math.abs(1 - height1 / width1);
        const image2 = picture2.querySelector('img');
        const width2 = Math.max(image2.height, image2.width);
        const height2 = Math.min(image2.height, image2.width);
        const squareness2 = Math.abs(1 - height2 / width2);
        let chosenPicture;
        if (isDesktop) {
          chosenPicture = (squareness1 >= squareness2) ? picture1 : picture2;
        } else {
          chosenPicture = (squareness1 <= squareness2) ? picture1 : picture2;
        }
        section.append(buildBlock('hero', { elems: [chosenPicture] }));
      }
    } else {
      // eslint-disable-next-line no-bitwise
      if (h1 && picture1 && (h1.compareDocumentPosition(picture1) & Node.DOCUMENT_POSITION_PRECEDING)) {
        section.append(buildBlock('hero', { elems: [picture1] }));
      }
    }
    main.prepend(section);
  }
}

function buildBreadcrumb(main) {
  const section = document.createElement('div');
  section.append(buildBlock('breadcrumb', [[]]));
  main.prepend(section);
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildBreadcrumb(main);
    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

export function getBasePath(fullURL) {
  try {
    const parsedURL = new URL(fullURL);
    const pathName = parsedURL.pathname;
    return pathName.substring(0, pathName.indexOf('.'));
  } catch (eww) { }
}

export function getMetaContentByName(name) {
  return document.querySelector(`meta[name="${name}"]`)?.content;
}

/**
 * Gets the Index and puts it into Session Storage. 
 * If the Index was previously fetch'd, then it just gets it from there.
 * @returns {Object} The Index
 */
export async function getIndex() {
  let indexJSON = sessionStorage.getItem('index');
  if (!indexJSON) {
    try {
      const resp = await fetch('/en/home/our-science/query-index.json');
      indexJSON = JSON.stringify(await resp.json());
      sessionStorage.setItem('index', indexJSON);
    } catch (error) {
      console.error('Fetching Index failed', error);
    }
  }
  const indexObj = await JSON.parse(indexJSON);
  indexObj.getEntry = function (basePath) {
    for (const entry of indexObj.data) {
      if (basePath === entry.path) {
        return entry;
      }
    }
  }
  return indexObj;
}

export function createEl(name, attributes = {}, content, parentEl) {
  const el = document.createElement(name);
  for (const attrName in attributes) {
    el.setAttribute(attrName, attributes[attrName]);
  }
  if (content) {
    el.append(content);
  }
  if (parentEl) {
    parentEl.append(el);
  }
  return el;
}

async function assembleMegaMenu() {

  const megaMenuData = await getMegaMenuData();

  const megaMenuContainer = createEl('div', {
    id: 'mega-menu-container'
  }, '', document.body);

  const firstLevelMenusContainer = createEl('div', {
    id: 'first-level-rail'
  }, '', megaMenuContainer);

  const collapsableContainer = createEl('div', {
    id: 'collapsable-container'
  }, '', megaMenuContainer);

  const menuButtonBar = document.createElement('div');
  menuButtonBar.id = 'menu-button-bar';
  // menuButtonBar.innerHTML = '<a id="back-button">&lt</a><a id="close-button">&#x2715</a>'
  collapsableContainer.append(menuButtonBar);

  const backButton = createEl('a', {
    id: 'back-button',
    href: '#'
  }, '< Back', menuButtonBar);

  const spacer = createEl('span', {}, '', menuButtonBar);

  const closeButton = createEl('a', {
    id: 'close-button',
    href: '#'
  }, '✕', menuButtonBar);

  const levelsHolder = document.createElement('div');
  levelsHolder.id = 'levels-holder';
  collapsableContainer.append(levelsHolder);


  //** more footer start */
  const moreFooter = createEl('div', {
    id: 'more-footer'
  }, '', collapsableContainer);

  const footerSocialData = megaMenuData.querySelector('.more-footer .social-icons');
  footerSocialData.querySelectorAll('img').forEach(image => {
    const src = image.getAttribute('src');
    if (src.startsWith('/')) {
      image.setAttribute('src', `https://poco.entegris.com${src}`);
    }
  });

  const moreFooterSocial = createEl('div', {
    id: 'more-footer-social'
  }, footerSocialData, moreFooter);

  const footerLogoLinksData = megaMenuData.querySelector('.more-footer .logo-right');
  footerLogoLinksData.querySelectorAll('a').forEach(link => {
    const href = link.getAttribute('href');
    if (href.startsWith('/')) {
      link.setAttribute('href', `https://poco.entegris.com${href}`);
    }
  });
  const logoLink = footerLogoLinksData.querySelector('.logo-link');
  const logoObj = logoLink.removeChild(logoLink.querySelector('.logo'));
  createEl('img', {
    src: 'https://poco.entegris.com/content/dam/web/ux/global/header/entg-poco-ms-header-desktop.svg',
    class: 'logo',
    alt: 'Logo'
  }, '', logoLink);

  moreFooter.append(footerLogoLinksData);
  //** more footer end */

  const firstFlyoutPanel = document.createElement('div');
  firstFlyoutPanel.id = 'second-level-flyout';
  firstFlyoutPanel.classList.add('menus-container');
  levelsHolder.append(firstFlyoutPanel);

  const secondFlyoutPanel = document.createElement('div');
  secondFlyoutPanel.id = 'third-level-flyout';
  secondFlyoutPanel.classList.add('menus-container');
  levelsHolder.append(secondFlyoutPanel);

  const multiTierNav = megaMenuData.querySelector('.multi-tier-container');

  // TODO: Move this logic to a decorateRelativeLinks function
  megaMenuData.querySelectorAll('img').forEach(img => {
    const src = img.getAttribute('src');
    if (src.startsWith('/')) {
      img.src = `https://poco.entegris.com${src}`;
    }
  });

  const mainDataSections = megaMenuData?.querySelector('#finder')?.querySelectorAll('.icon-bar > .icon_middle');
  const extraDataSections = megaMenuData?.querySelector('.multi-tier-container > .icon-bar')?.querySelectorAll('.icon_middle');
  [...mainDataSections, ...extraDataSections].forEach(dataSection => {
    const icon = dataSection.querySelector(':scope > a');
    firstLevelMenusContainer.append(icon);
    icon.id = icon.dataset.icons;
    icon.href = '#';

    icon.addEventListener('click', (e) => {
      closeLastLevel();
      if (loadNextLevel(icon.id)) {
        e.preventDefault();
      }
    });

    if (icon.classList.contains('oursites-icon')) {
      icon.id = 'our-sites';
    } else if (icon.classList.contains('more-icon')) {
      icon.id = 'more-icon';
    }

    const secondLevelItemList = document.createElement('div');
    secondLevelItemList.classList.add('item-list');
    secondLevelItemList.dataset.belongsTo = icon.id;

    const itemListHeader = createEl('div', {
      class: 'item-list-header'
    }, icon.querySelector('span').textContent, secondLevelItemList);

    if (icon.id === 'our-sites') {
      const siteLinks = megaMenuData.querySelector('.site-links');
      secondLevelItemList.append(siteLinks);
      firstFlyoutPanel.append(secondLevelItemList);
    } else if (icon.id === 'more-icon') {
      // secondLevelItemList.id = 'more';
      // firstFlyoutPanel.querySelectorAll('.item-list')?.forEach(menu => {
      //   if (menu.dataset.belongsTo !== 'our-sites') {
      //     console.log(menu)
      //     const menuNode = menu.cloneNode(true); //This wont work... need to parse the nodes
      //     menuNode.style.display = 'flex';
      //     secondLevelItemList.append(menuNode);
      //   }
      // });

      firstFlyoutPanel.append(secondLevelItemList);

    } else if (icon.id === 'products') { //Need to treat Products slightly different than the other Sections
      const subDataSections = dataSection?.querySelectorAll('.icon_middle > ul > li');
      subDataSections?.forEach(subDataSection => {

        const secondLevelItem = document.createElement('a');
        secondLevelItem.href = subDataSection.dataset.url;
        secondLevelItem.textContent = subDataSection.querySelector('p')?.textContent;
        secondLevelItem.addEventListener('click', (e) => {
          if (loadNextLevel(secondLevelItem.id)) {
            if (!isDesktop) {
              closeButton.style.display = 'none';
              backButton.style.display = 'inline';
              firstFlyoutPanel.classList.add('collapsed');
            }
            e.preventDefault();
          }
        });

        const subSubDataSections = subDataSection.querySelectorAll(':scope > ul > li');

        secondLevelItemList.append(secondLevelItem);

        if (subSubDataSections?.length > 0) {
          secondLevelItem.classList.add('has-children');
          const thirdLevelItemList = createEl('div', {
            class: 'item-list'
          }, '', secondFlyoutPanel);
          thirdLevelItemList.dataset.belongsTo = secondLevelItem.id;
          subSubDataSections.forEach(subSubDataSection => {
            let thirdLevelItem = createEl('a', {
              href: `https://poco.entegris.com${subSubDataSection.dataset.url}`
            }, subSubDataSection.querySelector('p')?.textContent, thirdLevelItemList);
          });

          if (subSubDataSections?.length > 0) {
            const thirdLevelHeaderItem = secondLevelItem.cloneNode(true);
            secondLevelItem.id = `${subDataSection.dataset.key}_item`; //Set the Id *after* it's cloned
            thirdLevelHeaderItem.classList.add('header');
            thirdLevelItemList.prepend(thirdLevelHeaderItem);
            thirdLevelItemList.dataset.belongsTo = secondLevelItem.id;
          }

          secondFlyoutPanel.append(thirdLevelItemList);
        }

        firstFlyoutPanel.append(secondLevelItemList);
      });
    } else {
      const subDataSections = dataSection?.querySelectorAll('.icon_middle > ul > li');
      subDataSections?.forEach(subDataSection => {

        const secondLevelItem = document.createElement('a');
        secondLevelItem.href = subDataSection.dataset.url;
        secondLevelItem.textContent = subDataSection.querySelector('p')?.textContent;

        const subSubDataSections = subDataSection.querySelectorAll(':scope > ul > li');
        let itemListDivider;
        if (subSubDataSections?.length > 0) {
          if (itemListDivider) {
            secondLevelItemList.append(itemListDivider);
          }
          secondLevelItem.classList.add('header');
        }
        itemListDivider = createEl('div', {
          class: 'item-list-divider'
        }, '', secondLevelItemList);

        itemListDivider.append(secondLevelItem);

        subSubDataSections?.forEach(subSubDataSection => {
          const secondLevelSubItem = document.createElement('a');
          secondLevelSubItem.href = subSubDataSection.dataset.url;
          secondLevelSubItem.addEventListener('click', (e) => {
            if (loadNextLevel(secondLevelSubItem.id)) {
              if (!isDesktop) {
                closeButton.style.display = 'none';
                backButton.style.display = 'inline';
                firstFlyoutPanel.classList.add('collapsed');
              }
              if (!secondLevelSubItem.closest('.full'))
                e.preventDefault();
            }
          });

          secondLevelSubItem.textContent = subSubDataSection.querySelector('p')?.textContent;

          const thirdLevelItemList = document.createElement('div');
          thirdLevelItemList.classList.add('item-list');
          thirdLevelItemList.dataset.belongsTo = secondLevelItem.id;

          const subSubSubDataSections = subSubDataSection.querySelectorAll(':scope > ul > li');

          itemListDivider.append(secondLevelSubItem);

          subSubSubDataSections?.forEach(subSubSubDataSection => {
            const thirdLevelItem = document.createElement('a');
            thirdLevelItem.href = subSubSubDataSection.dataset.url;
            thirdLevelItem.textContent = subSubSubDataSection.querySelector('p')?.textContent;
            thirdLevelItemList.append(thirdLevelItem);
          });
          if (subSubSubDataSections?.length > 0) {
            secondLevelSubItem.classList.add('has-children');
            const thirdLevelHeaderItem = secondLevelSubItem.cloneNode(true);
            secondLevelSubItem.id = `${subSubDataSection.dataset.key}_item`; //Set the Id *after* it's cloned
            thirdLevelHeaderItem.classList.add('header');
            thirdLevelItemList.prepend(thirdLevelHeaderItem);
            thirdLevelItemList.dataset.belongsTo = secondLevelSubItem.id;
          }
          if (secondLevelSubItem.id) {
            secondFlyoutPanel.append(thirdLevelItemList);
          }
        });

        firstFlyoutPanel.append(secondLevelItemList);
      });
    }

  });

  closeButton.addEventListener('click', (e) => {
    closeLastLevel();
  });

  backButton.addEventListener('click', (e) => {
    closeLastLevel();
    closeButton.style.display = 'inline';
    backButton.style.display = 'none';
    firstFlyoutPanel.classList.remove('collapsed');
  })

  function closeLastLevel() {
    const lastShowing = levelsHolder.querySelectorAll('.showing');
    if (lastShowing?.length > 0) {
      lastShowing[lastShowing.length - 1].classList.remove('showing', 'full');
    }
    megaMenuContainer.querySelector('#more-footer').classList.remove('showing');
  }

  function loadNextLevel(id) {
    megaMenuContainer.querySelectorAll('[data-belongs-to]').forEach(subItem => {
      if (id && !subItem?.querySelector(`#${id}`))
        subItem.style.display = 'none';
    });
    const itemList = megaMenuContainer.querySelector(`[data-belongs-to="${id}"]`);
    if (itemList) {
      const menusContainer = itemList.closest('.menus-container');
      menusContainer?.classList.add('showing');
      if (itemList.dataset.belongsTo === 'more-icon') {
        menusContainer?.classList.add('full');
        megaMenuContainer.querySelector('#more-footer').classList.add('showing');
      }
      itemList.style.display = 'flex';
    }
    return (itemList);
  }
}

/**
 * Gets the external Mega Menu Data from AEM. 
  * @returns {String} The Menu HTML
 */
async function getMegaMenuData() {
  try {
    const resp = await fetch('/content/microsite-live/poco-live/en.multitiernavigation.html');
    const megaMenuMarkup = await resp.text();

    const megaMenu = new DOMParser().parseFromString(megaMenuMarkup, 'text/html');
    return megaMenu;
  } catch (error) {
    console.error('Fetching Mega Menu failed', error);
  }
}

async function assembleMobileMenu() {
  const mobileMenu = createEl('nav', {
    id: 'mobile-menu',
    class: 'mobile-menu-container'
  }, '', document.body);

  const menu = createEl('a', {
    href: '#',
    class: 'megamenu'
  }, 'Menu', mobileMenu);

  menu.addEventListener('click', () => {
    const megeMenuContainer = document.querySelector('#mega-menu-container');
    megeMenuContainer.classList.contains('show-mobile') ?
      megeMenuContainer.classList.remove('show-mobile') :
      megeMenuContainer.classList.add('show-mobile');
  });

  const goTop = createEl('a', {
    href: '#',
    class: 'gotop'
  }, 'Top', mobileMenu);

  const search = createEl('a', {
    href: '#',
    class: 'search'
  }, 'Search', mobileMenu);

  const mobileSearchMenu = createEl('div', {
    id: 'mobile-search'
  }, '', mobileMenu);

  search.addEventListener('click', () => {
    (mobileSearchMenu.classList.contains('showing')) ?
      mobileSearchMenu.classList.remove('showing') :
      mobileSearchMenu.classList.add('showing');
  });

  const tools = createEl('a', {
    href: '#',
    class: 'tools'
  }, 'Tools', mobileMenu);

  const toolsMenu = createEl('div', {
    id: 'tools-menu'
  }, '', document.body);

  tools.addEventListener('click', () => {
    (toolsMenu.classList.contains('show-mobile')) ?
      toolsMenu.classList.remove('show-mobile') :
      toolsMenu.classList.add('show-mobile');
  });

  const mobileSearchForm = createEl('form', {
    action: 'https://poco.entegris.com/content/microsite-live/poco-live/en/home/search.html',
    method: 'GET',
    id: 'mobile-search-form',
    name: 'mobile-search-form'
  }, '', mobileSearchMenu);

  const mobileSearchField = createEl('input', {
    type: 'text',
    name: 'q',
    autocomplete: 'off',
    id: 'mobile-search-input',
    placeholder: 'Search keywords...',
    maxlength: 64
  }, '', mobileSearchForm);

  const mobileSearchButton = createEl('input', {
    type: 'submit',
    name: 'q',
    autocomplete: 'off',
    id: 'mobile-search-button'
  }, '', mobileSearchForm);

  function assembleToolsMenu() {
    const contactUs = createEl('a', {
      id: 'contact-us-tool',
      href: 'https://poco.entegris.com/en/home/about-us/contact-us.html'
    }, 'Contact Us', toolsMenu);

    const careers = createEl('a', {
      id: 'careers-tool',
      href: 'https://www.entegris.com/careers'
    }, 'Careers', toolsMenu);

    const search = createEl('a', {
      id: 'search-tool',
      href: '#'
    }, 'Search', toolsMenu);

    const searchFlyout = createEl('div', {
      id: 'search-flyout',
    }, '', toolsMenu);

    search.addEventListener('click', () => {
      (searchFlyout.classList.contains('showing')) ?
        searchFlyout.classList.remove('showing') :
        searchFlyout.classList.add('showing');
    });

    searchFlyout.innerHTML = `
      <div class="button-row"><a href="#">✕</a></div>
      <div class="title-row">
        <img src="https://poco.entegris.com/content/dam/web/ux/global/navigation/utility/Search_1x_Grey.svg" alt="search"/>
        Search
      </div>
      <form action="https://poco.entegris.com/content/microsite-live/poco-live/en/home/search.html" method="get" name="search_form" id="search-form">
        <input type="text" autocomplete="off" class="search-input" id="tools-search-input" aria-label="Enter text to search" placeholder="Search keywords..." maxlength="64"/>
        <input type="submit" value="Search" class="tools-search-button" id="tools-search-button">
      </form>
    `;

    searchFlyout.querySelector('.button-row a').addEventListener('click', () => {
      (searchFlyout.classList.contains('showing')) ?
        searchFlyout.classList.remove('showing') :
        searchFlyout.classList.add('showing');
    });
  }
  assembleToolsMenu();
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    await getIndex();
    decorateMain(main);
    document.body.classList.add('appear');
    await waitForLCP(LCP_BLOCKS);
  }
}

/**
 * Adds the favicon.
 * @param {string} href The favicon URL
 */
export function addFavIcon(href) {
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/png';
  link.href = href;
  const existingLink = document.querySelector('head link[rel="icon"]');
  if (existingLink) {
    existingLink.replaceWith(link);
  } else {
    document.head.append(link);
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadBlocks(main);
  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));
  await assembleMegaMenu();
  await assembleMobileMenu();

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  addFavIcon(`${window.hlx.codeBasePath}/styles/favicon.png`);
  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
