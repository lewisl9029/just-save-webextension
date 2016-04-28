'use strict';

const logResult = result => {
  if (browser.extension.lastError) {
    return console.error(browser.extension.lastError);
  }
  
  return console.log(result);
};

// avoids duplicates on upgrade by removing existing menu items first
browser.contextMenus.removeAll(result => {
  logResult(result);
  
  const handleMenuClick = clickContext => {
    if (clickContext.menuItemId !== 'just-save') {
      return;
    }
    
    const url = clickContext.srcUrl || clickContext.linkUrl || clickContext.pageUrl; 
    
    if (!url) {
      return console.error(`No url found for current click context`);
    }
    
    // need to specify filename for non-image contexts to workaround firefox name bug
    // TODO: document this bug and report on https://discourse.mozilla-community.org/c/add-ons/development
    const filename = clickContext.srcUrl ? 
      undefined : 
      clickContext.linkUrl ? 'link.htm' : 'page.htm';
    
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
  
  const menuProperties = {
    id: 'just-save',
    title: 'Just Save',
    // contexts: ['all']
    contexts: ['all'],
    // workaround for onClick.addListener bug below
    onclick: handleMenuClick
  };
    
  browser.contextMenus.create(
    menuProperties,
    logResult
  );
  
  // doesn't seem to work?
  // TODO: report as a bug
  // browser.contextMenus.onClicked.addListener(handleMenuClick);
});
