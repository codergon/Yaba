chrome.alarms.create({ periodInMinutes: 0.12 });

async function handleRequest(url, options = null) {
  try {
    const response = await fetch(url, options);
    if (response.ok) return await response.json();
  } catch {
    return false;
  }
  return false;
}

const getToken = async () =>
  (await chrome.identity.getAuthToken({ interactive: true })).token;

async function getGoogleUser(token) {
  const { user } = await chrome.storage.local.get(["user"]);
  if (user) return user;
  const url = chrome.runtime.getURL("api-keys.json");
  const fileResponse = await fetch(url);
  const { googleApiKey } = await fileResponse.json();
  let init = {
    async: true,
    method: "GET",
    contentType: "json",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  };

  console.log("Getting google user");

  const userData = await handleRequest(
    `https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses,photos&key=${googleApiKey}`,
    init
  );

  const userContacts = await handleRequest(
    `https://people.googleapis.com/v1/otherContacts?sources=READ_SOURCE_TYPE_CONTACT&readMask=emailAddresses,names,photos&key=${googleApiKey}`,
    init
  );

  const response = {
    user: userData,
    userContacts: userContacts?.otherContacts,
  };

  if (!!response) return response;

  return false;
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
            title: "Welcome to the modern age of productivity",
            link: "https://twitter.com/yabaextension",
            description: "Learn more about Yaba by clicking the link below",
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

const login = async sendResponse => {
  try {
    const token = await getToken();
    if (!token) sendResponse(false);
    const user = await getGoogleUser(token);
    await sendFirstToast();
    sendResponse({ user });
  } catch (error) {
    console.log(error.message);
    sendResponse({ error: error?.message });
  }
};

const logout = async sendResponse => {
  try {
    const token = await getToken();
    if (!token) sendResponse(false);
    await chrome.storage.local.remove("user");
    await chrome.storage.local.remove("userContacts");
    var url = "https://accounts.google.com/o/oauth2/revoke?token=" + token;
    await handleRequest(url);
    await closeAllToasts();
    chrome.identity.removeCachedAuthToken({ token });
    await chrome.storage.local.set({ isLoggedIn: false });
    sendResponse(true);
  } catch (error) {
    console.log(error);
    sendResponse(false);
  }
};

// helper function to wrap chrome runtime
function sendAction(action) {
  chrome.runtime.sendMessage(action);
}

// async function storageGet(getObject) {
//   return new Promise((resolve, reject) => {
//     chrome.storage.local.get(getObject, items => {
//       resolve(items);
//     });
//   });
// }

// async function storageSet(setObject) {
//   return new Promise((resolve, reject) => {
//     chrome.storage.local.set(setObject, () => {
//       resolve();
//     });
//   });
// }
