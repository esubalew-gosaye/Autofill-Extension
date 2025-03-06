// Wait for the page to fully load
window.addEventListener('load', () => {
    const url = new URL(window.location.href).hostname;
  
    // Retrieve saved credentials from storage
    chrome.storage.local.get(url, (data) => {
      if (data[url]) {
        const { username, password } = data[url];
        console.log('Retrieved credentials:', username, password);
  
        // Try to find the username and password fields
        const usernameField = document.querySelector('input[type="text"], input[name="username"], input[id="username"]');
        const passwordField = document.querySelector('input[type="password"], input[name="password"], input[id="password"]');
  
        if (usernameField && passwordField) {
          console.log('Input fields found:', usernameField, passwordField);
          usernameField.value = username;
          passwordField.value = password;
          console.log('Credentials auto-filled successfully!');
        } else {
          console.error('Input fields not found. Check the selectors.');
        }
      } else {
        console.log('No saved credentials for this website.');
      }
    });
  });