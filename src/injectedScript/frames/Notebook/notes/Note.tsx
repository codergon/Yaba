import dayjs from "dayjs";
import { Check } from "lucide-react";
import { NoteType } from "../components/NotebookProvider";

const isToday = (activeDate: Date) =>
  activeDate.getDate() === new Date().getDate() &&
  activeDate.getMonth() === new Date().getMonth();

interface NoteProps {
  item: NoteType;
  selected: any[];
  isSelect: boolean;
  openNote: (note: NoteType) => void;
  setSelected: (value: any) => void;
}

const Note = ({
  item,
  openNote,
  isSelect,
  selected,
  setSelected,
}: NoteProps) => {
  // @ts-ignore
  const date = new Date(item?.date);
  const daysAgo = dayjs(date).diff(new Date(), "days");
  const dateIsToday = isToday(date);
  const dateIsYesterday = daysAgo === -1;
  const dateIsThisWeek = Math.abs(daysAgo) <= 6;

  return (
    <button
      onClick={e => {
        e.preventDefault();

        if (isSelect) {
          if (selected.includes(item?.id)) {
            setSelected(selected.filter(i => i !== item?.id));
          } else {
            setSelected((p: any) => [...p, item?.id]);
          }
        } else {
          openNote(item);
        }
      }}
      className="yaba-notebook__notes--list-item"
    >
      <div className="yaba-notebook__notes--list-item__inner">
        {isSelect && (
          <div
            data-checked={selected.includes(item?.id)}
            className="yaba-notebook__notes--list-item__checkbox"
          >
            <Check size={10} strokeWidth={3.4} />
          </div>
        )}

        {/* Note */}
        <div className="yaba-notebook__notes--list-item__details">
          <h2 className="title">{item?.title}</h2>
          <p className="date">
            {(dateIsToday ? "" : dateIsYesterday ? "Yesterday, " : "") +
              dayjs(date).format(
                dateIsToday
                  ? "HH:mm"
                  : dateIsYesterday
                  ? ""
                  : dateIsThisWeek
                  ? "dddd"
                  : "ddd, D MMM"
              )}
          </p>
        </div>
      </div>
    </button>
  );
};

export default Note;
