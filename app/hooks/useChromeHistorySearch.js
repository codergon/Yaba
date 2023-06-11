import { useState, useEffect } from "react";

const useChromeHistorySearch = query => {
  const [historyItems, setHistoryItems] = useState([]);

  useEffect(() => {
    chrome.history
      .search(query)
      .then(historyItems => setHistoryItems(historyItems))
      .catch(console.error);
  }, [query]);

  return historyItems;
};

export default useChromeHistorySearch;
