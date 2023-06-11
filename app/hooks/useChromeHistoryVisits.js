import { useState, useEffect } from "react";

const useChromeHistoryVisits = url => {
  const [visitItems, setVisitItems] = useState([]);

  useEffect(() => {
    chrome.history
      .getVisits(url)
      .then(visitItems => setVisitItems(visitItems))
      .catch(error => console.error);
  }, [url]);

  return visitItems;
};

export default useChromeHistoryVisits;
