chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log("Message: ", msg);
  console.log("Sender: ", sender);
  sendResponse("From the background script");
});
