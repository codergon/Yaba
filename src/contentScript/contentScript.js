const sendMeta = sendResponse => {
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

    sendResponse(metaObj);
  } catch (error) {
    console.log(error);
    sendResponse(false);
  }
};

chrome.runtime.onMessage.addListener(function (req, sdr, sendResponse) {
  if (req.type === "getMeta") {
    sendMeta(sendResponse);
    return true;
  }
});
