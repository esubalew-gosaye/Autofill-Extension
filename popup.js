// Get the current website's hostname
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const url = new URL(tabs[0].url).hostname;

  // Retrieve saved credentials from storage
  chrome.storage.local.get(url, (data) => {
    if (data[url]) {
      const { username, password } = data[url];
      // Populate the input fields
      document.getElementById('username').value = username;
      document.getElementById('password').value = password;
    } else {
      console.log('No saved credentials for this website.');
    }
  });
});

// Save credentials when the button is clicked
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