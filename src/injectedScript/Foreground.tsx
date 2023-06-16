import Toasts from "./frames/Toasts";
import { useRecoilState } from "recoil";
import Notebook from "./frames/Notebook";
import { useEffect, useState } from "react";
import { reminderDataState } from "./atoms/foreState";

interface ForegroundProps {
  isNotes: boolean;
  setFrameWidth: (width: number) => void;
  setFrameHeight: (height: number) => void;
}

const Foreground: React.FC<ForegroundProps> = ({
  isNotes,
  setFrameWidth,
  setFrameHeight,
}) => {
  const [showNotes, setShowNotes] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [remData, setRemData] = useRecoilState(reminderDataState);

  const toggleNotification = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 1500);
  };

  const processItems = async (newBookmark: any) => {
    const newList =
      newBookmark.toastType === "welcome"
        ? [...remData, newBookmark].filter(i => i?.id === newBookmark?.id)
        : remData.length < 2
        ? [...remData, newBookmark]
        : [remData[1], newBookmark];
    setRemData(newList);
  };

  const closeToast = async (item: any, all?: boolean) => {
    if (all) {
      setRemData([]);
      return;
    }

    const newList = remData.filter(i => i.id !== item?.id);
    setRemData(newList);
  };

  useEffect(() => {
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

      if (req.cmd === "toggle-notes") {
        isNotes && setShowNotes(p => !p);
        return true;
      }

      if (req.cmd === "bookmark-tab") {
        toggleNotification();
        return true;
      }
    });
  }, []);

  return !isNotes ? (
    <Toasts
      setFrameWidth={setFrameWidth}
      setFrameHeight={setFrameHeight}
      showNotification={showNotification}
    />
  ) : (
    <>
      {showNotes && (
        <Notebook
          setFrameWidth={setFrameWidth}
          setFrameHeight={setFrameHeight}
        />
      )}
    </>
  );
};

export default Foreground;
