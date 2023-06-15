import { memo } from "react";
import HistoryItem from "./HistoryItem";
import { useAppStore } from "../../../context/AppContext";
import dayjs from "dayjs";
import EmptyState from "../../../common/EmptyState";

const MemoizedHistoryItem = memo(HistoryItem);

const History = () => {
  const { noMatch, groupedHistory } = useAppStore();

  return (
    <div className="history__list">
      {!noMatch ? (
        <>
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
        </>
      ) : (
        <EmptyState noVector noMatch title={"No history matched your search"} />
      )}
    </div>
  );
};

export default History;
