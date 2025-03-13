// Auto-fill credentials when the page loads
window.addEventListener('load', () => {
  const url = new URL(window.location.href).hostname;

  chrome.storage.local.get([url], (data) => {
    let credentials = [];
    if (data[url]) {
      credentials = Array.isArray(data[url]) ? data[url] : [data[url]];
    }
    if (credentials.length > 0) {
      // Use the first credential by default
      const { username, password } = credentials[0];

      // Try to find the username and password fields
      const usernameField = findInputField(['input[type="text"]', 'input[name="username"]', 'input[id="username"]']);
      const passwordField = findInputField(['input[type="password"]', 'input[name="password"]', 'input[id="password"]']);

      if (usernameField && passwordField) {
        usernameField.value = username;
        passwordField.value = password;
      }
    }
  });
});

// Helper function to find input fields
function findInputField(selectors) {
  for (const selector of selectors) {
    const field = document.querySelector(selector);
    if (field) {
      return field;
    }
  }
  return null;
}