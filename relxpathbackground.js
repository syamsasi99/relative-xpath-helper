

'use strict';

function handleRequest(request, sender, cb) {
  chrome.tabs.sendMessage(sender.tab.id, request, cb);
}
chrome.runtime.onMessage.addListener(handleRequest);

chrome.browserAction.onClicked.addListener(function(tab) {

  chrome.tabs.sendMessage(tab.id, {type: 'togglePopup'});
});
