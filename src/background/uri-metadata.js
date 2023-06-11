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
