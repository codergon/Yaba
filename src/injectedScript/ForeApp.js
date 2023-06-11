import "./styles/foreground.scss";
import {
  pageMarkersObj,
  reminderDataState,
  showMarkerState,
} from "./atoms/foreState";
import Toast from "./components/AppToast";
import { useEffect, useRef } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { QueryClient, QueryClientProvider } from "react-query";

const ForeApp = () => {
  const [remData, setRemData] = useRecoilState(reminderDataState);
  const [showMarker, setShowMarker] = useRecoilState(showMarkerState);

  const processItems = async newBookmark => {
    console.log(newBookmark?.id);
    const newList =
      newBookmark.toastType === "welcome"
        ? [...remData, newBookmark].filter(i => i?.id === newBookmark?.id)
        : remData.length < 2
        ? [...remData, newBookmark]
        : [remData[1], newBookmark];
    setRemData(newList);
  };

  const closeToast = async (item, all) => {
    if (all) {
      setRemData([]);
      return;
    }

    const newList = remData.filter(i => i.id !== item?.id);
    setRemData(newList);
  };

  chrome.runtime.onMessage.addListener(async (req, sdr, sendRes) => {
    if (req.cmd === "close-all-toasts") {
      await closeToast(null, true);
      return true;
    }

    if (req.cmd === "toastify" && req?.item) {
      await processItems(req?.item);
      return true;
    }

    if (req.cmd === "close-toast" && req?.item) {
      await closeToast(req.item);
      return true;
    }

    if (req.cmd === "show-markers") {
      setShowMarker(!showMarker);
      return true;
    }
  });

  const setPageMarker = useSetRecoilState(pageMarkersObj);

  const renderSetup = async () => {
    const { pageMarkers } = await chrome.storage.sync.get("pageMarkers");
    setPageMarker(pageMarkers || {});
  };

  useEffect(() => {
    renderSetup();
  }, []);

  const ref = useRef(null);
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="yaba-toast-container">
        {remData?.map(item => (
          <Toast item={item} key={item?.id} duration={10} />
        ))}
      </div>
    </QueryClientProvider>
  );
};

export default ForeApp;
