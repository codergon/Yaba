import dayjs from "dayjs";
import { isToday } from "../../../../utils/helpers";

const DateHeader = ({ date }) => {
  const formatedDate = new Date(date);
  const daysAgo = dayjs(formatedDate).diff(new Date(), "days");

  return (
    <div className="space-area__comment-items__date">
      <p>
        {isToday(formatedDate)
          ? "Today"
          : dayjs(formatedDate).format(
              Math.abs(daysAgo) <= 6 ? "dddd" : "ddd, D MMM"
            )}
      </p>
    </div>
  );
};

export default DateHeader;
