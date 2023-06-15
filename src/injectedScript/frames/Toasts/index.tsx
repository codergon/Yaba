import Toast from "./AppToast";
import "../../styles/foreground.scss";
import { useEffect } from "react";
import "../../styles/foreground.scss";
import { useRecoilValue } from "recoil";
import useMeasure from "react-use-measure";
import { CheckCircle } from "phosphor-react";
import { reminderDataState } from "../../atoms/foreState";

const Toasts = ({ setFrameWidth, setFrameHeight, showNotification }: any) => {
  const [containerRef, bounds] = useMeasure();
  const remData = useRecoilValue(reminderDataState);

  useEffect(() => {
    setFrameWidth(bounds.width);
    setFrameHeight(bounds.height);
  }, [bounds.width, bounds.height]);

  return (
    <div className="yaba-toast-container" ref={containerRef}>
      {showNotification && (
        <div className={`yaba-notification-toast auto-width`}>
          <div
            style={{
              gap: "6px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              whiteSpace: "nowrap",
              color: "var(--primary-color)",
            }}
          >
            <CheckCircle size={18} weight="fill" color="#3ea845" />
            <p className="yaba-toast__link-details__content-title">
              Page bookmarked successfully
            </p>
          </div>
        </div>
      )}

      {remData?.map((item: any) => (
        <Toast item={item} key={item?.id} duration={10} />
      ))}
    </div>
  );
};

export default Toasts;
