chrome.runtime.sendMessage("I am loading content script", response => {
  console.log("Content Script: ", response);
});

window.onload = event => {
  console.log("page is fully loaded");
};
