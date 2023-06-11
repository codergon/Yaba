try {
  importScripts("reminder.js");
  importScripts("background-utils.js");
  importScripts("uri-metadata.js");
} catch (e) {
  console.error(e);
}

chrome.commands.onCommand.addListener(async command => {
  if (command === "inject-markers") {
    const tabId = await getCurrentTab();

    !!tabId &&
      !isNaN(tabId) &&
      chrome.tabs.sendMessage(tabId, { cmd: "show-markers" });
  }

  if (command === "full-screen") {
    const tabId = await getCurrentTab();

    !!tabId &&
      !isNaN(tabId) &&
      chrome.tabs.sendMessage(tabId, { cmd: "full-screen" });
  }
});

const dismissToast = async (sendResponse, item) => {
  if (item?.toastType !== "welcome") {
    const { notifications } = await storageGet(["notifications"]);
    const { unread } = await chrome.storage.sync.get(["unread"]);

    let notiCount = !isNaN(unread) ? unread : 0;
    let newNotifications = Array.isArray(notifications)
      ? [...notifications]
      : [];
    notiCount = notiCount - 1;

    await storageSet({
      notifications: newNotifications.filter(r => r.id !== item?.id),
    });
    await chrome.storage.sync.set({ unread: notiCount > 0 ? notiCount : 0 });

    await chrome.action.setBadgeText({
      text: (notiCount > 0 ? notiCount : "") + "",
    });
  }

  const allTabs = await chrome.tabs.query({});

  allTabs.forEach(tab => {
    isValidUrl(tab?.url) &&
      !isNaN(tab?.id) &&
      chrome.tabs.sendMessage(
        tab?.id,
        { cmd: "close-toast", item },
        function (res) {
          var error = chrome.runtime.lastError;
          if (error) return;
        }
      );
  });

  sendResponse(true);
};

const handleFullScreen = async (sendResponse, command) => {
  const allTabs = await chrome.tabs.query({});

  allTabs.forEach(tab => {
    isValidUrl(tab?.url) &&
      !isNaN(tab?.id) &&
      chrome.tabs.sendMessage(tab?.id, { cmd: command }, function (res) {
        var error = chrome.runtime.lastError;
        if (error) return;
      });
  });

  sendResponse(true);
};

const fetchUrl = async (sendResponse, url) => {
  try {
    const meta = await uriMeta(url);

    if (meta && meta !== null) {
      sendResponse(meta);
    } else {
      sendResponse(null);
    }
  } catch (error) {
    console.log(error);
    sendResponse(null);
  }

  sendResponse(null);
};

chrome.runtime.onMessage.addListener(function (req, sdr, sendResponse) {
  var error = chrome.runtime.lastError;
  if (error) console.error(error);

  if (req.type === "fetch-url") {
    fetchUrl(sendResponse, req.url);
    return true;
  }

  if (req.type === "dismiss-toast") {
    dismissToast(sendResponse, req.item);
    return true;
  }

  if (req.type === "open-fullscreen") {
    handleFullScreen(sendResponse, "open-fullscreen");
    return true;
  }

  if (req.type === "close-fullscreen") {
    handleFullScreen(sendResponse, "close-fullscreen");
    return true;
  }

  if (req.type === "mark-unread") {
    chrome.action.setBadgeText({ text: "" });
    return true;
  }

  if (req.type === "login") {
    login(sendResponse);
    return true;
  }
  if (req.type === "logout") {
    logout(sendResponse);
    return true;
  }
});
