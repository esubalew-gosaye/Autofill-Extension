chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const url = new URL(tabs[0].url).hostname;

  chrome.storage.local.get(url, (data) => {
    if (data[url]) {
      const { username, password } = data[url];
      document.getElementById('username').value = username;
      document.getElementById('password').value = password;
    }
  });
});

document.getElementById('save').addEventListener('click', () => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = new URL(tabs[0].url).hostname;
    chrome.storage.local.set({ [url]: { username, password } }, () => {
      alert('Credentials saved!');
    });
  });
});

document.getElementById('fill').addEventListener('click', () => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (!username || !password) {
    alert('Please enter both username and password.');
    return;
  }

  // Send a message to the content script to fill the fields
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'fill', username, password }, (response) => {
      if (response && response.success) {
        console.log('Fields filled successfully!');
      } else {
        console.error('Failed to fill fields.');
      }
    });
  })
})