import { memo } from "react";
import HistoryItem from "./HistoryItem";
import { useAppStore } from "../../../context/AppContext";
import dayjs from "dayjs";

const MemoizedHistoryItem = memo(HistoryItem);

const History = () => {
  const { groupedHistory } = useAppStore();

  return (
    <div className="history__list">
      {Object.keys(groupedHistory).map((key, index) => {
        return (
          <div key={index} className="history__list-group">
            <div className="history__list-group__header">
              <p>
                {dayjs(key).format("ddd, DD MMMM YYYY")} (
                {groupedHistory[key].length})
              </p>
            </div>

            <div className="history__list-items">
              {groupedHistory[key].map(item => {
                return <MemoizedHistoryItem item={item} key={item.id} />;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default History;
