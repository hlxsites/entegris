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

const isDesktop = window.matchMedia('(min-width: 900px)');

const LCP_BLOCKS = []; // add your LCP blocks to the list

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture] }));
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
  for(const attrName in attributes) {
    el.setAttribute(attrName, attributes[attrName]);
  }
  if(content) {
    el.append(content);
  }
  if(parentEl) {
    parentEl.append(el);
  }
  return el;
}

async function assembleMegaMenu() {
  const megaMenuContainer = document.createElement('div');
  megaMenuContainer.id = 'mega-menu-container';
  document.querySelector('body').append(megaMenuContainer);

  const firstLevelMenusContainer = document.createElement('div');
  firstLevelMenusContainer.id = 'first-level-container';
  megaMenuContainer.append(firstLevelMenusContainer);

  const collapsableContainer = document.createElement('div');
  collapsableContainer.id = 'collapsable-container';
  megaMenuContainer.append(collapsableContainer);

  const menuButtonBar = document.createElement('div');
  menuButtonBar.id = 'menu-button-bar';
  menuButtonBar.innerHTML = '<a id="close-button">&#x2715</a>'
  collapsableContainer.append(menuButtonBar);

  const levelsHolder = document.createElement('div');
  levelsHolder.id = 'levels-holder';
  collapsableContainer.append(levelsHolder);

  const secondLevelMenusContainer = document.createElement('div');
  secondLevelMenusContainer.id = 'second-level-container';
  secondLevelMenusContainer.classList.add('menus-container');
  levelsHolder.append(secondLevelMenusContainer);

  const thirdLevelMenusContainer = document.createElement('div');
  thirdLevelMenusContainer.id = 'third-level-container';
  thirdLevelMenusContainer.classList.add('menus-container');
  levelsHolder.append(thirdLevelMenusContainer);

  const megaMenuData = await getMegaMenuData();
  console.log('menu', megaMenuData);
  const multiTierNav = megaMenuData.querySelector('.multi-tier-container');

  // TODO: Move this logic to a decorateRelativeLinks function
  megaMenuData.querySelectorAll('img').forEach(img => {
    const src = img.getAttribute('src');
    if (src.startsWith('/')) {
      img.src = `https://poco.entegris.com${src}`;
    }
  });

  const mainSections = megaMenuData?.querySelector('#finder')?.querySelectorAll('.icon-bar > .icon_middle');
  const extraSections = megaMenuData?.querySelector('.multi-tier-container > .icon-bar')?.querySelectorAll('.icon_middle');
  [...mainSections, ...extraSections].forEach(section => {
    const icon = section.querySelector(':scope > a');
    firstLevelMenusContainer.append(icon);
    icon.id = icon.dataset.icons;

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

    if (icon.id === 'our-sites') {
      const siteLinks = megaMenuData.querySelector('.site-links');
      secondLevelItemList.append(siteLinks);
      secondLevelMenusContainer.append(secondLevelItemList);
    } else if (icon.id === 'more-icon') {
      // const siteLinks = megaMenuData.querySelector('.site-links');
      // secondLevelItemList.append(siteLinks);
      secondLevelItemList.id = 'more';
      secondLevelMenusContainer.querySelectorAll('.item-list:not(#more)')?.forEach(menu => {
        const menuNode = menu.cloneNode(true); //This wont work... need to parse the nodes
        menuNode.style.display = 'flex';
        secondLevelItemList.append(menuNode);
      });
      
      
      secondLevelMenusContainer.append(secondLevelItemList);

    } else {
      const subSections = section?.querySelectorAll('.icon_middle > ul > li');
      subSections?.forEach(subSection => {

        const secondLevelItem = document.createElement('a');
        secondLevelItem.href = subSection.dataset.url;
        secondLevelItem.textContent = subSection.querySelector('p')?.textContent;

        const subSubSections = subSection.querySelectorAll(':scope > ul > li');
        if (subSubSections?.length > 0) {
          secondLevelItem.classList.add('header');
        }

        secondLevelItemList.append(secondLevelItem);

        subSubSections?.forEach(subSubSection => {
          const secondLevelSubItem = document.createElement('a');
          secondLevelSubItem.href = subSubSection.dataset.url;
          secondLevelSubItem.addEventListener('click', (e) => {
            if (loadNextLevel(secondLevelSubItem.id)) {
              e.preventDefault();
            }
          });

          secondLevelSubItem.textContent = subSubSection.querySelector('p')?.textContent;

          const thirdLevelItemList = document.createElement('div');
          thirdLevelItemList.classList.add('item-list');
          thirdLevelItemList.dataset.belongsTo = secondLevelItem.id;

          const subSubSubSections = subSubSection.querySelectorAll(':scope > ul > li');

          secondLevelItemList.append(secondLevelSubItem);

          subSubSubSections?.forEach(subSubSubSection => {
            const thirdLevelItem = document.createElement('a');
            thirdLevelItem.href = subSubSubSection.dataset.url;
            thirdLevelItem.textContent = subSubSubSection.querySelector('p')?.textContent;
            thirdLevelItemList.append(thirdLevelItem);
          });
          if (subSubSubSections?.length > 0) {
            secondLevelSubItem.classList.add('has-children');
            const thirdLevelHeaderItem = secondLevelSubItem.cloneNode(true);
            secondLevelSubItem.id = subSubSection.dataset.key; //Set the Id *after* it's cloned
            thirdLevelHeaderItem.classList.add('header');
            thirdLevelItemList.prepend(thirdLevelHeaderItem);
            thirdLevelItemList.dataset.belongsTo = secondLevelSubItem.id;
          }
          if (secondLevelSubItem.id) {
            thirdLevelMenusContainer.append(thirdLevelItemList);
          }
        });

        secondLevelMenusContainer.append(secondLevelItemList);
      });
    }
  });

  const menuCloseButton = megaMenuContainer.querySelector('#close-button');
  menuCloseButton.addEventListener('click', (e) => {
    closeLastLevel();
  })

  function closeLastLevel() {
    const lastShowing = levelsHolder.querySelectorAll('.showing');
    if (lastShowing?.length > 0) {
      lastShowing[lastShowing.length - 1].classList.remove('showing', 'full');
    }
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
      if(itemList.dataset.belongsTo === 'more-icon') {
        menusContainer?.classList.add('full');
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
    const resp = await fetch('https://poco.entegris.com/content/microsite-live/poco-live/en.multitiernavigation.html');
    const megaMenuMarkup = await resp.text();

    const megaMenu = new DOMParser().parseFromString(megaMenuMarkup, 'text/html');
    return megaMenu;
  } catch (error) {
    console.error('Fetching Mega Menu failed', error);
  }
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
  assembleMegaMenu();
  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

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
