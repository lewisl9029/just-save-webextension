'use strict';

const itemTypes = {
  page: {
    id: 'page',
    title: 'Page',
    urlProperty: 'pageUrl'
  },
  link: {
    id: 'link',
    title: 'Link',
    urlProperty: 'linkUrl'
  },
  image: {
    id: 'image',
    title: 'Image',
    urlProperty: 'srcUrl'
  }
};

const logResult = result => {
  if (browser.extension.lastError) {
    return console.error(browser.extension.lastError);
  }
  
  return console.log(result);
};

const createDownloadCallback = itemType => {
  console.log(itemType);
};

const createMenuProperty = itemType => ({
  title: `Save ${itemType.title}`,
  contexts: [itemType.id],
  onclick: clickContext => {
    const url = clickContext[itemType.urlProperty];
    
    if (!url) {
      return console.error(`No ${itemType.urlProperty} found for ${itemType.title} context`);
    }
    
    const downloadOptions = {
      url
      //TODO: need to specify for non-image contexts to workaround firefox name bug
      //TODO: document this bug and report on https://discourse.mozilla-community.org/c/add-ons/development
      // filename: '' 
      // url,
      // conflictAction: 'prompt', //not implemented yet in firefox, defaults to uniquify
      // saveAs: false //not implemented yet in firefox, defaults to false
    };
    
    browser.downloads.download(
      downloadOptions, 
      logResult
    );
  }
});

//TODO: create single contextmenu item, save depending on context
// priority = image -> link -> page
browser.contextMenus.create(
  createMenuProperty(itemTypes.page),
  logResult
);

browser.contextMenus.create(
  createMenuProperty(itemTypes.link),
  logResult
);

browser.contextMenus.create(
  createMenuProperty(itemTypes.image),
  logResult
);