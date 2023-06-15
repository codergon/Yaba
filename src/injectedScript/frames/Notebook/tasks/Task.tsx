import { Check } from "lucide-react";
import { TaskType, useNotebook } from "../components/NotebookProvider";

interface TaskProps {
  item: TaskType;
  isSelect: boolean;
  selected: string[];
  setSelected: (value: any) => void;
}

const Task = ({ item, isSelect, selected, setSelected }: TaskProps) => {
  const { toggleTask } = useNotebook();

  return (
    <div
      className={`yaba-notebook__tasks--list-item ${
        item.done ? "completed" : ""
      }`}
    >
      <div className="yaba-notebook__tasks--list-item__inner">
        <button
          data-checked={isSelect ? selected.includes(item?.id) : item?.done}
          onClick={e => {
            e.preventDefault();

            if (isSelect) {
              if (selected.includes(item?.id)) {
                setSelected(selected.filter(i => i !== item?.id));
              } else {
                setSelected((p: any) => [...p, item?.id]);
              }
            } else {
              toggleTask(item?.id);
            }
          }}
          className="yaba-notebook__tasks--list-item__checkbox"
        >
          <Check size={10} strokeWidth={3.4} />
        </button>

        <div className="yaba-notebook__tasks--list-item__details">
          <h2 className="title">{item?.content}</h2>
        </div>
      </div>
    </div>
  );
};

export default Task;
