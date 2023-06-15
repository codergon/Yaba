import { useEffect } from "react";
import "../../styles/notebook.scss";
import "../../styles/draftjs.scss";
import Tabs from "./components/tabs";
import useMeasure from "react-use-measure";

const Notebook = ({
  setFrameWidth,
  setFrameHeight,
}: {
  setFrameWidth: (width: number) => void;
  setFrameHeight: (height: number) => void;
}) => {
  const [containerRef, bounds] = useMeasure();
  useEffect(() => {
    setFrameWidth(bounds.width);
    setFrameHeight(bounds.height);
  }, [bounds.width, bounds.height]);

  return (
    <div className="yaba-notebook" ref={containerRef}>
      <Tabs />
    </div>
  );
};

export default Notebook;
