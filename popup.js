// Load credentials when the popup opens
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const url = new URL(tabs[0].url).hostname;
  loadCredentials(url);
});

// Save or update credentials
document.getElementById('save').addEventListener('click', () => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (!username || !password) {
    alert('Please enter both username and password.');
    return;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = new URL(tabs[0].url).hostname;
    saveOrUpdateCredentials(url, username, password);
  });
});

// Save or update credentials to storage
function saveOrUpdateCredentials(url, username, password) {
  chrome.storage.local.get([url], (data) => {
    let credentials = [];
    if (data[url]) {
      credentials = Array.isArray(data[url]) ? data[url] : [data[url]];
    }

    // Check if we're updating an existing credential
    const indexToUpdate = credentials.findIndex(cred => cred.username === username);
    if (indexToUpdate !== -1) {
      credentials[indexToUpdate] = { username, password };
    } else {
      credentials.push({ username, password });
    }

    chrome.storage.local.set({ [url]: credentials }, () => {
      loadCredentials(url);
    });
  });
}

// Load credentials and display them
function loadCredentials(url) {
  chrome.storage.local.get([url], (data) => {
    let credentials = [];
    if (data[url]) {
      credentials = Array.isArray(data[url]) ? data[url] : [data[url]];
    }
    const credentialsList = document.getElementById('credentials-list');
    credentialsList.innerHTML = '';

    credentials.forEach((cred, index) => {
      const credDiv = document.createElement('div');
      credDiv.className = 'credential-item';
      credDiv.innerHTML = `
        <span>${cred.username.length > 10 ? cred.username.slice(0, 18) + '...' : cred.username}</span>
        <i class="fas fa-edit icon-edit" data-username="${cred.username}" data-password="${cred.password}"></i>
        <i class="fas fa-arrow-up icon-up" title="Move up" data-index="${index}"></i>
        <i class="fas fa-right-to-bracket icon-fill" title="Use this" data-username="${cred.username}" data-password="${cred.password}"></i>
        <i class="fas fa-trash icon-remove" data-index="${index}"></i>
      `;
      credentialsList.appendChild(credDiv);
    });

    attachEventListeners(url);
  });
}

// Toggle password visibility
document.querySelector('.icon-toggle-password').addEventListener('click', () => {
  const passwordField = document.getElementById('password');
  const icon = document.querySelector('.icon-toggle-password');

  if (passwordField.type === 'password') {
    passwordField.type = 'text';
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
  } else {
    passwordField.type = 'password';
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
  }
});

// Attach event listeners to icons
function attachEventListeners(url) {
  const editIcons = document.querySelectorAll('.icon-edit');
  const upIcons = document.querySelectorAll('.icon-up');
  const downIcons = document.querySelectorAll('.icon-down');
  const fillIcons = document.querySelectorAll('.icon-fill');
  const removeIcons = document.querySelectorAll('.icon-remove');

  // Edit credential
  editIcons.forEach((icon) => {
    icon.addEventListener('click', () => {
      const username = icon.getAttribute('data-username');
      const password = icon.getAttribute('data-password');
      document.getElementById('username').value = username;
      document.getElementById('password').value = password;
    });
  });

  // Move credential up
  upIcons.forEach((icon) => {
    icon.addEventListener('click', () => {
      const index = parseInt(icon.getAttribute('data-index'));
      moveCredential(url, index, index - 1);
    });
  });

  // Fill credential
  fillIcons.forEach((icon) => {
    icon.addEventListener('click', () => {
      const username = icon.getAttribute('data-username');
      const password = icon.getAttribute('data-password');
      fillFields(username, password);
    });
  });

  // Remove credential
  removeIcons.forEach((icon) => {
    icon.addEventListener('click', () => {
      const index = parseInt(icon.getAttribute('data-index'));
      removeCredential(url, index);
    });
  });
}

// Move a credential up or down
function moveCredential(url, fromIndex, toIndex) {
  chrome.storage.local.get([url], (data) => {
    let credentials = [];
    if (data[url]) {
      credentials = Array.isArray(data[url]) ? data[url] : [data[url]];
    }

    if (toIndex < 0 || toIndex >= credentials.length) {
      return;
    }

    const cred = credentials.splice(fromIndex, 1)[0];
    credentials.splice(toIndex, 0, cred);

    chrome.storage.local.set({ [url]: credentials }, () => {
      loadCredentials(url);
    });
  });
}

// Remove a credential
function removeCredential(url, index) {
  chrome.storage.local.get([url], (data) => {
    let credentials = [];
    if (data[url]) {
      credentials = Array.isArray(data[url]) ? data[url] : [data[url]];
    }
    credentials.splice(index, 1);
    chrome.storage.local.set({ [url]: credentials }, () => {
      loadCredentials(url);
    });
  });
}

// Fill fields on the current page
function fillFields(username, password) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: (username, password) => {
        const usernameField = document.querySelector('input[type="text"], input[name="username"], input[id="username"]');
        const passwordField = document.querySelector('input[type="password"], input[name="password"], input[id="password"]');

        if (usernameField && passwordField) {
          usernameField.value = username;
          passwordField.value = password;
        }
      },
      args: [username, password]
    }, () => {});
  });
}