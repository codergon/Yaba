import { useState, useEffect } from "react";

const useMaxResults = defaultMaxItems => {
  const [maxItems, setMaxItems] = useState(defaultMaxItems);

  useEffect(() => {
    const scrollListener = () => {
      const { scrollHeight, clientHeight, scrollTop } = document.body;
      if (scrollHeight - clientHeight - scrollTop <= 50) {
        setMaxItems(maxItems => maxItems + 10);
      }
    };

    document.body.addEventListener("scroll", scrollListener);
    return () => {
      document.body.removeEventListener("scroll", scrollListener);
    };
  }, []);

  return maxItems;
};

export default useMaxResults;
