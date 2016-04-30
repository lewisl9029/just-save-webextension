'use strict';
// FIXME: need to keep this on a separate codebase due to
// need for separate manifest file because persistent attribute is rejected
// https://bugzilla.mozilla.org/show_bug.cgi?id=1253565
// should be able to revert to single codebase when Firefox 48 is released

// FIXME: figure out how to prevent toolbar icon from being added in chrome

// adding browser shim for chrome support
if (window.browser === undefined) {
  window.browser = chrome;
  window.isChrome = true;  
}

const logResult = result => {
  if (browser.extension.lastError) {
    return;
    // debugging to console is not allowed for production extensions according to
    // preliminary review for firefox: 
    // Please note the following for the next update:
    // 1) Your add-on prints debugging information to the Console, which is generally not allowed in production add-ons.

    // return console.error(browser.extension.lastError);
  }
  
  // return console.log(result);
};


const addOnInstalledListener = handleInstalled => isChrome ? 
  // enables use of non-persistent event page for chrome (not supported in firefox)
  // https://developer.chrome.com/extensions/event_pages
  () => browser.runtime.onInstalled.addListener(handleInstalled) :
  () => handleInstalled();
  

const createMenuItems = () => {
  // avoids duplicates on upgrade by removing existing menu items first
  browser.contextMenus.removeAll(result => {
    logResult(result);
    
    const menuProperties = {
      id: 'just-save',
      title: 'Just Save',
      contexts: ['all']
    };
    
    browser.contextMenus.create(
      menuProperties,
      logResult
    );
  });
};

addOnInstalledListener(createMenuItems);

const downloadElement = clickContext => {
  if (clickContext.menuItemId !== 'just-save') {
    return;
  }
  
  const url = clickContext.srcUrl || clickContext.linkUrl || clickContext.pageUrl; 
  
  if (!url) {
    // return console.error(`No url found for current click context`);
    return;
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

browser.contextMenus.onClicked.addListener(downloadElement);