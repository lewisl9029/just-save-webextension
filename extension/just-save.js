'use strict';
// FIXME: need to keep this on a separate codebase due to
// need for separate manifest file because persistent attribute is rejected
// https://bugzilla.mozilla.org/show_bug.cgi?id=1253565
// should be able to revert to single codebase when Firefox 48 is released

// FIXME: figure out how to prevent toolbar icon from being added in chrome

let isChrome = window.browser === undefined;

// adding browser shim for chrome support
if (isChrome) {
  window.browser = chrome;
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


const addOnInstalledListener = handleInstalled => {
  if (isChrome) {
    // enables use of non-persistent event page for chrome (not supported in firefox)
    // https://developer.chrome.com/extensions/event_pages
    return browser.runtime.onInstalled.addListener(handleInstalled);
  } 
  
  return handleInstalled();
};

const addOnClickListener = handleClick => {
  if (isChrome) {
    // workaround for firefox contextMenus.onClicked.addListener bug
    return browser.contextMenus.onClicked.addListener(handleClick);
  }
};
  
const downloadElement = clickContext => {
  if (clickContext.menuItemId !== 'just-save') {
    return;
  }
  
  const url = clickContext.srcUrl || clickContext.linkUrl || clickContext.pageUrl; 
  
  if (!url) {
    // return console.error(`No url found for current click context`);
    return;
  }
  
  // need to specify filename for non-image contexts to workaround firefox name bug
  // TODO: document this bug and report on https://discourse.mozilla-community.org/c/add-ons/development
  const filename = isChrome ? 
    undefined :
    clickContext.srcUrl ? 
      undefined : 
      // FIXME: not ideal for links to actual files, images, etc
      clickContext.linkUrl ? 'link.htm' : 'page.htm';
  
  const downloadOptions = {
    url,
    filename
    // filename,
    // conflictAction: 'prompt', //not implemented yet in firefox 47, defaults to uniquify
    // saveAs: false //not implemented yet in firefox 47, defaults to false
  };
  
  browser.downloads.download(
    downloadOptions, 
    logResult
  );
};

const createMenuItems = () => {
  // avoids duplicates on upgrade by removing existing menu items first
  browser.contextMenus.removeAll(result => {
    logResult(result);
    
    const menuProperties = {
      id: 'just-save',
      title: 'Just Save',
      contexts: ['all'],
      // workaround for firefox contextMenus.onClicked.addListener bug
      onclick: isChrome ? undefined : downloadElement 
    };
    
    browser.contextMenus.create(
      menuProperties,
      logResult
    );
  });
};

addOnInstalledListener(createMenuItems);
addOnClickListener(downloadElement);

// FIXME: doesn't seem to work?
// TODO: report as a bug
// browser.contextMenus.onClicked.addListener(downloadElement);