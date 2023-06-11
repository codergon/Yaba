const docWidth = () => window.innerWidth;
const getURL = () => window.location.href.toString();
const docHeight = () => document.documentElement.scrollHeight;

const isValidUrl = url =>
  url !== undefined &&
  url?.indexOf("chrome") != 0 &&
  url?.indexOf("file") !== 0;

const sendMeta = () => {
  try {
    var metaObj = { meta: {}, og: {}, twitter: {} };
    const AddMeta = (attr, content) => {
      if (attr === null) return;
      if (attr.match(/^og:/s)) {
        metaObj["og"][attr.split(/^og:/s)[1]] = content;
      } else if (attr.match(/^twitter:/s)) {
        metaObj["twitter"][attr.split(/^twitter:/s)[1]] = content;
      } else {
        metaObj["meta"][attr] = content;
      }
    };

    var metas = document.getElementsByTagName("meta");
    for (var i = 0; i < metas.length; i++) {
      var name = metas[i].getAttribute("name");
      var content = metas[i].getAttribute("content");
      var property = metas[i].getAttribute("property");
      AddMeta(name !== null ? name : property, content);
    }

    return metaObj;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const addOrUpdateUrlParam = (name, value) => {
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

const urlIncludesParam = (name = "yaba-share-id") => {
  var href = window.location.href;
  var regex = new RegExp("[&\\?]" + name + "=");
  return regex.test(href);
};

const getUrlParam = (name = "yaba-share-id") => {
  let paramString = window.location.href.split("?")[1];
  let queryString = new URLSearchParams(paramString);
  for (let pair of queryString.entries()) {
    if (pair[0] === name) {
      return pair[1];
    }
  }
};

function removeParam(key = "yaba-share-id", sourceURL = window.location.href) {
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
