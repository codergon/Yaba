async function getCurrentTab(isTab = false) {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return isTab ? tab : tab?.id;
}

const isValidUrl = url =>
  url !== undefined &&
  url?.indexOf("chrome") != 0 &&
  url?.indexOf("file") !== 0;

const nextTime = (repeat, former) => {
  var newDate = new Date(0);
  newDate.setUTCMilliseconds(former);
  const currDay = newDate.getDay();
  const currDate = newDate.getDate();
  const currMonth = newDate.getMonth();

  switch (repeat) {
    case "daily":
      newDate.setDate(currDate + 1);
      break;

    case "weekly":
      newDate.setDate(currDate + 7);
      break;

    case "monthly":
      newDate.setMonth(currMonth + 1);
      break;

    case "weekdays":
      newDate.setDate(
        currDay === 6
          ? currDate + 2
          : currDay === 5
          ? currDate + 3
          : currDate + 1
      );
      break;

    case "weekends":
      newDate.setDate(currDay < 5 ? currDate + 6 - currDay : currDate + 1);
      break;

    default:
      break;
  }

  return newDate.getTime();
};

chrome.alarms.onAlarm.addListener(async () => {
  const { bookmarksArr, notifications } = await chrome.storage.local.get([
    "bookmarksArr",
    "notifications",
  ]);
  const { unread } = await chrome.storage.sync.get(["unread"]);

  let notiCount = !isNaN(unread) ? unread : 0;
  let newNotifications = Array.isArray(notifications) ? [...notifications] : [];

  const updatedList = Array.isArray(bookmarksArr)
    ? await Promise.all(
        bookmarksArr?.map(async item => {
          if (
            new Date().getTime() - Number(item?.date) >= 0 &&
            (!item?.expired || item?.repeat !== "never")
          ) {
            if (!item?.autoTrigger) {
              // increment the number of unread notifications
              notiCount++;
              await chrome.storage.sync.set({
                unread: notiCount > 0 ? notiCount : 0,
              });

              // Add the notification to the list
              newNotifications.unshift({
                type: "reminder",
                link: item?.link,
                title: item?.title,
                id: crypto.randomUUID(),
                time: new Date().getTime(),
                categories: item?.categories,
                description: item?.description,
              });

              // Send all tabs the toastify cmd
              const allTabs = await chrome.tabs.query({});

              allTabs.forEach(tab => {
                isValidUrl(tab?.url) &&
                  !isNaN(tab?.id) &&
                  !item?.paused &&
                  chrome.tabs.sendMessage(
                    tab?.id,
                    { cmd: "toastify", item },
                    function (response) {
                      var error = chrome.runtime.lastError;
                      if (error) return;
                    }
                  );
              });
            } else {
              // Open the link in a new tab
              chrome.tabs.create({ url: item?.link });
            }

            return item?.repeat === "never"
              ? { ...item, expired: true }
              : {
                  ...item,
                  expired: false,
                  date: Number(nextTime(item?.repeat, Number(item?.date))),
                };
          } else {
            return item;
          }
        })
      )
    : [];

  await chrome.storage.local.set({
    bookmarksArr: updatedList,
    notifications: newNotifications,
  });

  const tab = await getCurrentTab(true);
  isValidUrl(tab?.url) &&
    chrome.runtime.sendMessage(
      {
        cmd: "refetch",
        updatedList,
        newNotifications,
      },
      function (response) {
        var error = chrome.runtime.lastError;
        if (error) return;
      }
    );

  isValidUrl(tab?.url) &&
    chrome.tabs.sendMessage(
      tab?.id,
      {
        cmd: "refetch",
        updatedList,
        newNotifications,
      },
      function (response) {
        var error = chrome.runtime.lastError;
        if (error) return;
      }
    );

  if (notiCount) {
    chrome.action.setBadgeText({ text: (notiCount > 0 ? notiCount : "") + "" });
    // chrome.action.setBadgeBackgroundColor({ color: "#2bf000" });
  }
});
