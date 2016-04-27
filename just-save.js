'use strict';

const logResult = result => {
  if (browser.extension.lastError) {
    return console.error(browser.extension.lastError);
  }
  
  return console.log(result);
};

const menuProperty = {
  title: `Just Save`,
  contexts: ['all'],
  onclick: clickContext => {
    const url = clickContext.srcUrl || clickContext.linkUrl || clickContext.pageUrl; 
    
    if (!url) {
      return console.error(`No url found for current click context`);
    }
    
    const downloadOptions = {
      url,
      //TODO: document this bug and report on https://discourse.mozilla-community.org/c/add-ons/development
      //need to specify for non-image contexts to workaround firefox name bug
      filename: clickContext.srcUrl ? undefined : 'page.html'
      // url,
      // conflictAction: 'prompt', //not implemented yet in firefox, defaults to uniquify
      // saveAs: false //not implemented yet in firefox, defaults to false
    };
    
    browser.downloads.download(
      downloadOptions, 
      logResult
    );
  }
};

browser.contextMenus.create(
  menuProperty,
  logResult
);