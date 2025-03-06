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


  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: fillFields,
      args: [username, password]
    }, () => {
      console.log('Fields filled successfully!');
    });
  });
});


function fillFields(username, password) {
  const usernameField = document.querySelector('input[type="text"], input[name="username"], input[id="username"]');
  const passwordField = document.querySelector('input[type="password"], input[name="password"], input[id="password"]');

  if (usernameField && passwordField) {
    usernameField.value = username;
    passwordField.value = password;
    console.log('Fields filled successfully!');
  } else {
    console.error('Input fields not found. Check the selectors.');
  }
}