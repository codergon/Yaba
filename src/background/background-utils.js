chrome.alarms.create({ periodInMinutes: 0.12 });

// wrapper function, on V3 manifest storage has promises
function storageSet(obj = {}) {
  return new Promise((resolve, reject) => {
    var storageObj = {};
    for (let u = 0; u < Object.keys(obj).length; u++) {
      const key = Object.keys(obj)[u];
      const objectToStore = obj[key];
      var jsonstr = JSON.stringify(objectToStore);
      var i = 0;

      // split jsonstr into chunks and store them in an object indexed by `key_i`
      while (jsonstr.length > 0) {
        var index = key + "USEDTOSEPERATE" + i++;

        // since the key uses up some per-item quota, see how much is left for the value
        // also trim off 2 for quotes added by storage-time `stringify`
        const maxLength =
          chrome.storage.sync.QUOTA_BYTES_PER_ITEM - index.length - 2;
        var valueLength = jsonstr.length;
        if (valueLength > maxLength) {
          valueLength = maxLength;
        }

        // trim down segment so it will be small enough even when run through `JSON.stringify` again at storage time
        //max try is QUOTA_BYTES_PER_ITEM to avoid infinite loop
        var segment = jsonstr.substring(0, valueLength);
        var jsonLength = JSON.stringify(segment).length;
        segment = jsonstr.substring(
          0,
          (valueLength = valueLength - (jsonLength - maxLength) - 1)
        );
        for (let i = 0; i < chrome.storage.sync.QUOTA_BYTES_PER_ITEM; i++) {
          jsonLength = JSON.stringify(segment).length;
          if (jsonLength > maxLength) {
            segment = jsonstr.substring(0, --valueLength);
          } else {
            break;
          }
        }

        storageObj[index] = segment;
        jsonstr = jsonstr.substring(valueLength, Infinity);
      }
    }
    chrome.storage.sync.set(storageObj).then(() => {
      resolve();
    });
  });
}

function storageGet(uniqueKeys = []) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(null).then(data => {
      const keyArr = Object.keys(data).filter(
        e => uniqueKeys.filter(j => e.indexOf(j) == 0).length > 0
      );
      chrome.storage.sync.get(keyArr).then(items => {
        var results = {};
        for (let i = 0; i < uniqueKeys.length; i++) {
          const uniqueKey = uniqueKeys[i];
          const keysFiltered = keyArr.filter(
            e => e.split("USEDTOSEPERATE")[0] == uniqueKey
          );
          if (keysFiltered.length > 0) {
            results[uniqueKey] = "";
            for (let x = 0; x < keysFiltered.length; x++) {
              results[uniqueKey] += items[`${keysFiltered[x]}`];
            }

            results[uniqueKey] = JSON.parse(results[uniqueKey]);
          }
        }
        resolve(results);
      });
    });
  });
}

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
  const { user } = await storageGet(["user"]);
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

  // if (userContacts)
  //   await storageSet({
  //     userContacts: userContacts?.otherContacts,
  //   });

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
    await chrome.storage.sync.remove("user");
    await chrome.storage.sync.remove("userContacts");
    var url = "https://accounts.google.com/o/oauth2/revoke?token=" + token;
    await handleRequest(url);
    await closeAllToasts();
    chrome.identity.removeCachedAuthToken({ token });
    await chrome.storage.sync.set({ isLoggedIn: false });
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
//     chrome.storage.sync.get(getObject, items => {
//       resolve(items);
//     });
//   });
// }

// async function storageSet(setObject) {
//   return new Promise((resolve, reject) => {
//     chrome.storage.sync.set(setObject, () => {
//       resolve();
//     });
//   });
// }
