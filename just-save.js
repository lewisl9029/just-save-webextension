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
      url,
      conflictAction: 'prompt',
      saveAs: false
    };
    
    browser.downloads.download(downloadOptions);
  }
});

const logResult = result => {
  if (browser.extension.lastError) {
    return console.error(browser.extension.lastError);
  }
  
  return console.log(result);
};

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