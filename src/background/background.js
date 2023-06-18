try {
  importScripts("reminder.js");
} catch (e) {
  console.error(e);
}

async function uriMeta(url) {
  const init = {
    headers: {
      Accept: "application/json, text/plain, */*",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept",
      "Content-Type": "application/json, text/plain, */*",
    },
  };

  let response;
  try {
    response = await fetch(url, init);
    return response?.text() || null;
  } catch (err) {
    return null;
  }
}

const sendFirstToast = async () => {
  const allTabs = await chrome.tabs.query({});

  allTabs.forEach(tab => {
    isValidUrl(tab?.url) &&
      !isNaN(tab?.id) &&
      chrome.tabs.sendMessage(
        tab?.id,
        {
          cmd: "toastify",
          item: {
            id: crypto.randomUUID(),
            toastType: "welcome",
            title: "Yaba - Reminders, Bookmarks, Workspaces and More",
            link: "https://getyaba.vercel.app",
            description: "",
            thumbnail:
              "https://ik.imagekit.io/alphaknight/Yaba-Welcome_oXRnakW0q.svg?ik-sdk-version=javascript-1.4.3&updatedAt=1678217042254",
          },
        },
        function (response) {
          var error = chrome.runtime.lastError;
          if (error) return;
        }
      );
  });
};

const dismissToast = async (sendResponse, item) => {
  if (item?.toastType !== "welcome") {
    const { notifications } = await chrome.storage.local.get(["notifications"]);
    const { unread } = await chrome.storage.local.get(["unread"]);

    let notiCount = !isNaN(unread) ? unread : 0;
    let newNotifications = Array.isArray(notifications)
      ? [...notifications]
      : [];
    notiCount = notiCount - 1;

    await chrome.storage.local.set({
      notifications: newNotifications.filter(r => r.id !== item?.id),
    });
    await chrome.storage.local.set({ unread: notiCount > 0 ? notiCount : 0 });

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

const closeAllToasts = async () => {
  const allTabs = await chrome.tabs.query({});

  allTabs.forEach(tab => {
    isValidUrl(tab?.url) &&
      !isNaN(tab?.id) &&
      chrome.tabs.sendMessage(
        tab?.id,
        { cmd: "close-all-toasts", item: null },
        function (res) {
          var error = chrome.runtime.lastError;
          if (error) return;
        }
      );
  });
};

const refreshAuth = async sendResponse => {
  chrome.runtime.sendMessage({ type: "refresh-auth-popup" });

  const allTabs = await chrome.tabs.query({});

  allTabs.forEach(tab => {
    isValidUrl(tab?.url) &&
      !isNaN(tab?.id) &&
      chrome.tabs.sendMessage(
        tab?.id,
        { cmd: "refresh-pages-auth" },
        function (res) {
          var error = chrome.runtime.lastError;
          if (error) return;
        }
      );
  });

  sendResponse(true);
};

const refreshPagesAuth = async sendResponse => {
  const allTabs = await chrome.tabs.query({});

  allTabs.forEach(tab => {
    isValidUrl(tab?.url) &&
      !isNaN(tab?.id) &&
      chrome.tabs.sendMessage(
        tab?.id,
        { cmd: "refresh-pages-auth" },
        function (res) {
          var error = chrome.runtime.lastError;
          if (error) return;
        }
      );
  });

  sendResponse(true);
};

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

chrome.runtime.onMessage.addListener(function (req, sdr, sendResponse) {
  var error = chrome.runtime.lastError;
  if (error) console.error(error);

  if (req.type === "dismiss-toast") {
    dismissToast(sendResponse, req.item);
    return true;
  }

  if (req.type === "refresh-auth") {
    refreshAuth(sendResponse);
    return true;
  }

  if (req.type === "refresh-pages-auth") {
    refreshPagesAuth(sendResponse);
    return true;
  }
});
