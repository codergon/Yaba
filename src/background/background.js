try {
  importScripts("reminder.js");
  importScripts("background-utils.js");
  importScripts("uri-metadata.js");
} catch (e) {
  console.error(e);
}

chrome.commands.onCommand.addListener(async command => {
  if (command === "toggle-notes") {
    const tabId = await getCurrentTab();
    !isNaN(tabId) && chrome.tabs.sendMessage(tabId, { cmd: "toggle-notes" });
  }

  if (command === "bookmark-tab") {
    const dateVal = new Date();
    const tab = await getCurrentTab(true);

    const response = await chrome.tabs.sendMessage(tab?.id, {
      type: "getMeta",
    });

    const { meta, og, twitter } = response;

    const newBookmark = {
      expired: true,
      paused: false,
      shared: false,
      link: tab?.url,
      sharedWith: [],
      categories: [],
      repeat: "never",
      autoTrigger: false,
      id: crypto.randomUUID(),
      date: Number(dateVal.getTime()),
      title: meta?.title || twitter?.title || og?.title || tab?.title,
      thumbnail: og?.image || twitter?.image || tab?.favIconUrl,
      description: meta?.description || og?.description || twitter?.description,
    };

    const { bookmarksArr } = await chrome.storage.local.get(["bookmarksArr"]);

    if (Array.isArray(bookmarksArr))
      await chrome.storage.local.set({
        bookmarksArr: [newBookmark, ...bookmarksArr],
      });

    !isNaN(tab?.id) &&
      (await chrome.tabs.sendMessage(tab?.id, {
        cmd: "bookmark-tab",
      }));
  }

  if (command === "full-screen") {
    const tabId = await getCurrentTab();
    !isNaN(tabId) && chrome.tabs.sendMessage(tabId, { cmd: "full-screen" });
  }
});

const dismissToast = async (sendResponse, item) => {
  if (item?.toastType !== "welcome") {
    const { notifications } = await chrome.storage.local.get(["notifications"]);
    const { unread } = await chrome.storage.sync.get(["unread"]);

    let notiCount = !isNaN(unread) ? unread : 0;
    let newNotifications = Array.isArray(notifications)
      ? [...notifications]
      : [];
    notiCount = notiCount - 1;

    await chrome.storage.local.set({
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
