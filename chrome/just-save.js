'use strict';

// adding browser shim for chrome support
window.browser = chrome;
window.isChrome = true;

const logResult = result => {
  if (browser.extension.lastError) {
    return console.error(browser.extension.lastError);
  }
  
  return console.log(result);
};

const menuProperty = {
  id: 'just-save',
  title: 'Just Save',
  contexts: ['all']
};

// ensure context menu item is only added when first installed
// enables use of non-persistent event page for chrome (not supported in firefox)
// https://developer.chrome.com/extensions/event_pages
browser.runtime.onInstalled.addListener(event => {
  // avoids duplicates by removing existing menu items first
  browser.contextMenus.removeAll(result => {
    logResult(result);
    
    browser.contextMenus.create(
      menuProperty,
      logResult
    );
    
    const handleMenuClick = clickContext => {
      if (clickContext.menuItemId !== 'just-save') {
        return;
      }
      
      const url = clickContext.srcUrl || clickContext.linkUrl || clickContext.pageUrl; 
      
      if (!url) {
        return console.error(`No url found for current click context`);
      }
      
      const filename = undefined;
      
      const downloadOptions = {
        url,
        filename
        // filename,
        // conflictAction: 'prompt', //not implemented yet in firefox, defaults to uniquify
        // saveAs: false //not implemented yet in firefox, defaults to false
      };
      
      browser.downloads.download(
        downloadOptions, 
        logResult
      );
    };
    
    browser.contextMenus.onClicked.addListener(handleMenuClick);
  });
});
