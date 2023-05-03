chrome.runtime.onInstalled.addListener(() => {
  console.log('ChatGPT File Drag extension installed');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getLogoURL') {
    sendResponse({logoURL: chrome.runtime.getURL('images/icon128.png')});
  }
});
