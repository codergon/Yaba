function truncateString(value, maxLength, options) {
  options = {
    truncateSymbol: "...",
    ...options,
  };
  const startIndex = 0;
  const endIndex = maxLength;

  return value?.length <= maxLength
    ? value
    : `${value?.substring(startIndex, endIndex)}${options.truncateSymbol}`;
}

function urlWithoutSchema(url) {
  return url?.replace(/https:\/\/|http:\/\/|www.|/gi, "");
}

function getDomainFromURL(url) {
  var domain = url.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0];
  return domain;
}

const getFaviconUrl = url => {
  return `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=128`;
};

export { getFaviconUrl, truncateString, urlWithoutSchema, getDomainFromURL };
