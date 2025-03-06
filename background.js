chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'fill') {
    const { username, password } = message;

    const usernameField = document.querySelector('input[type="text"], input[name="username"], input[id="username"]');
    const passwordField = document.querySelector('input[type="password"], input[name="password"], input[id="password"]');

    if (usernameField && passwordField) {
      usernameField.value = username;
      passwordField.value = password;
      console.log('Fields filled successfully!');
      sendResponse({ success: true });
    } else {
      console.error('Input fields not found.');
      sendResponse({ success: false });
    }
  }
});