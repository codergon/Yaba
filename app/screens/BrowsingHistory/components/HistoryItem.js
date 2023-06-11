import {
  getDomainFromURL,
  getFaviconUrl,
  truncateString,
  urlWithoutSchema,
} from "../services/helper";
import { useEffect, useState } from "react";
import { DotsThree } from "phosphor-react";
import { useAppMenu } from "../../../hooks";
import { useAppStore } from "../../../context/AppContext";

const DEFAULT_FAVICON = "https://www.gstatic.com/earth/00-favicon.ico";

const HistoryItem = ({ item }) => {
  const [img, setImg] = useState(null);
  const [imgError, setImgError] = useState(false);
  const { addBookmark, deleteHistory } = useAppStore();

  const url = urlWithoutSchema(item?.url ?? "");
  const faviconUrl = getFaviconUrl(item?.url ?? "");
  const lastVisitDate = new Date(item?.lastVisitTime ?? 0);
  const time = lastVisitDate.toLocaleTimeString().substring(0, 5);

  useEffect(() => {
    const getImg = async () => {
      try {
        const img = await fetch(faviconUrl);
        if (img.status === 200) {
          const image = await img.blob();
          setImg(URL.createObjectURL(image));
        } else {
          setImgError(true);
        }
      } catch (error) {
        setImgError(true);
      }
    };

    getImg();
  }, []);

  const onSelect = async option => {
    if (option === "bookmark" || option === "share") {
      await addBookmark({
        link: item?.url,
        dateVal: new Date(),
        ...(!imgError && { favicon: faviconUrl }),
        ...(option === "share" && { action: "share" }),
        title: item?.title || getDomainFromURL(item?.url),
      });
    } else if (option === "delete") {
      await deleteHistory(item?.url);
    }
  };

  const [AppMenu] = useAppMenu(
    "all",
    ["bookmark", "share", "delete"],
    onSelect
  );

  return (
    <li className="history-item">
      <div className="favicon-noOfVisits">
        <div className="favicon">
          <img
            width="16"
            height="16"
            loading="lazy"
            alt={`Favicon of: ${item?.url}`}
            src={img ?? DEFAULT_FAVICON}
          />
        </div>

        <div className="noOfVisits">
          <p>{item?.visitCount}</p>
        </div>
      </div>

      <div className="info">
        <div className="spaced-row title-menu">
          <p className="title">
            {truncateString(
              item?.title || getDomainFromURL(item?.url) || "",
              50
            )}
          </p>

          <AppMenu>
            <button className="menu-btn">
              <DotsThree size={22} weight="bold" />
            </button>
          </AppMenu>
        </div>

        <div className="spaced-row">
          <a
            className="item-link"
            href={item?.url}
            target="_blank"
            title={item?.url}
          >
            {truncateString(url, 30)}
          </a>

          <span className="time" title={lastVisitDate.toTimeString()}>
            {time}
          </span>
        </div>
      </div>
    </li>
  );
};

export default HistoryItem;
