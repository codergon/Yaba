const docWidth = (): number => window.innerWidth;
const getURL = (): string => window.location.href.toString();
const docHeight = (): number => document.documentElement.scrollHeight;

export const getReminderTimer = (remindWhen: string): Date => {
  const newDate = new Date();
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

const isValidUrl = (url: string | undefined): boolean =>
  url !== undefined &&
  url?.indexOf("chrome") !== 0 &&
  url?.indexOf("file") !== 0;

interface MetaObject {
  meta: { [attr: string]: string };
  og: { [attr: string]: string };
  twitter: { [attr: string]: string };
}

const sendMeta = (): MetaObject | null => {
  try {
    var metaObj: MetaObject = { meta: {}, og: {}, twitter: {} };
    const AddMeta = (attr: string | null, content: string | null) => {
      if (attr === null) return;
      if (attr.match(/^og:/s)) {
        metaObj["og"][attr.split(/^og:/s)[1]] = content ?? "";
      } else if (attr.match(/^twitter:/s)) {
        metaObj["twitter"][attr.split(/^twitter:/s)[1]] = content ?? "";
      } else {
        metaObj["meta"][attr] = content ?? "";
      }
    };

    var metas = document.getElementsByTagName("meta");
    for (var i = 0; i < metas.length; i++) {
      var name = metas[i].getAttribute("name");
      var content = metas[i].getAttribute("content");
      var property = metas[i].getAttribute("property");
      AddMeta(name !== null ? name : property, content !== null ? content : "");
    }

    return metaObj;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const addOrUpdateUrlParam = (name: string, value: string): string => {
  var href = window.location.href;
  var regex = new RegExp("[&\\?]" + name + "=");
  if (regex.test(href)) {
    regex = new RegExp("([&\\?])" + name + "=\\d+");
    return href.replace(regex, "$1" + name + "=" + value);
  } else {
    if (href.indexOf("?") > -1) return href + "&" + name + "=" + value;
    else return href + "?" + name + "=" + value;
  }
};

const urlIncludesParam = (name: string = "yaba-share-id"): boolean => {
  var href = window.location.href;
  var regex = new RegExp("[&\\?]" + name + "=");
  return regex.test(href);
};

const getUrlParam = (name: string = "yaba-share-id"): string | null => {
  let paramString = window.location.href.split("?")[1];
  let queryString = new URLSearchParams(paramString);
  for (let pair of queryString.entries()) {
    if (pair[0] === name) {
      return pair[1];
    }
  }
  return null;
};

function removeParam(
  key: string = "yaba-share-id",
  sourceURL: string = window.location.href
): string {
  var rtn = sourceURL.split("?")[0],
    param,
    params_arr = [],
    queryString = sourceURL.indexOf("?") !== -1 ? sourceURL.split("?")[1] : "";
  if (queryString !== "") {
    params_arr = queryString.split("&");
    for (var i = params_arr.length - 1; i >= 0; i -= 1) {
      param = params_arr[i].split("=")[0];
      if (param === key) {
        params_arr.splice(i, 1);
      }
    }
    if (params_arr.length) rtn = rtn + "?" + params_arr.join("&");
  }
  return rtn;
}

export {
  getURL,
  docWidth,
  sendMeta,
  docHeight,
  getUrlParam,
  removeParam,
  isValidUrl,
  urlIncludesParam,
  addOrUpdateUrlParam,
};
