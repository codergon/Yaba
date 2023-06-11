import uriMeta from "uri-metadata";
import { isValidUrl } from "../../utils/helpers";

const doubleDigit = val =>
  Number(val) >= 10 ? Number(val) : "0" + Number(val);

const fetchMetadata = async (
  tabId,
  setCurrMetas,
  setMetas,
  setUrlDescription
) => {
  chrome.tabs.sendMessage(tabId, { type: "getMeta" }, function (response) {
    if (response !== false) {
      setCurrMetas(response);
      setMetas(response);
      setUrlDescription(
        response?.meta?.description ||
          response?.og?.description ||
          response?.twitter?.description
      );
    }
  });
};

const debounceFn = (
  link,
  pageUrl,
  setTitle,
  setMetas,
  currMetas,
  currTitle,
  setLoading,
  setUrlDescription
) =>
  setTimeout(async () => {
    if (link === pageUrl || link.trim().length < 1) {
      setTitle(currTitle);
      if (!!currMetas) setMetas(currMetas);
      setUrlDescription(
        currMetas?.meta?.description ||
          currMetas?.og?.description ||
          currMetas?.twitter?.description
      );
    } else {
      let url;

      if (!isValidUrl(link)) {
        if (!/^https?:\/\//i.test(link)) {
          url = "http://" + link;
        } else {
          return;
        }
      }

      if (url && !isValidUrl(url)) return;

      setLoading(true);
      let metadata;

      try {
        metadata = await uriMeta.get(url ? url : link);
      } catch (error) {
        // setLink(pageUrl);

        setTitle(currTitle);
        setMetas(currMetas);
        setUrlDescription(
          currMetas?.meta?.description ||
            currMetas?.og?.description ||
            currMetas?.twitter?.description
        );
        setLoading(false);
      }

      if (metadata !== null && metadata) {
        setTitle(
          metadata?.meta?.title ||
            metadata?.twitter?.title ||
            metadata?.og?.title
        );
        setUrlDescription(
          metadata?.meta?.description ||
            metadata?.og?.description ||
            metadata?.twitter?.description
        );
        setMetas(metadata);
      } else {
        setTitle(currTitle);
        setMetas(currMetas);
        setUrlDescription(
          currMetas?.meta?.description ||
            currMetas?.og?.description ||
            currMetas?.twitter?.description
        );
      }

      setLoading(false);
    }
    setLoading(false);
  }, 1400);

const getReminderTimer = remindWhen => {
  var newDate = new Date();
  const currDay = newDate.getDay();
  const currDate = newDate.getDate();
  const currMonth = newDate.getMonth();
  const currMinute = newDate.getMinutes();

  switch (remindWhen) {
    case "Later today":
      newDate.setMinutes(currMinute + 30);
      break;

    case "Tomorrow morning":
      newDate.setDate(currDate + 1);
      newDate.setHours(8);
      newDate.setMinutes(0);
      newDate.setSeconds(0);
      break;

    case "Tomorrow evening":
      newDate.setDate(currDate + 1);
      newDate.setHours(20);
      newDate.setMinutes(0);
      newDate.setSeconds(0);
      break;

    case "This weekend":
      newDate.setDate(currDay < 5 ? currDate + 6 - currDay : currDate + 1);
      break;

    case "In a week":
      newDate.setDate(currDate + 7);
      break;

    case "In a month":
      newDate.setMonth(currMonth + 1);
      break;

    default:
      break;
  }

  return newDate;
};

export { doubleDigit, fetchMetadata, debounceFn, getReminderTimer };
