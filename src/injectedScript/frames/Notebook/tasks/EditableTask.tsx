import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { TaskType, useNotebook } from "../components/NotebookProvider";

interface EditableTaskProps {
  task: TaskType;
  isSelect: boolean;
  selected: string[];
  setShowNew: (value: any) => void;
  setSelected: (value: any) => void;
}

const EditableTask = ({
  task,
  isSelect,
  selected,
  setShowNew,
  setSelected,
}: EditableTaskProps) => {
  const inputRef = useRef<any>(null);
  const [edit, setEdit] = useState(false);
  const [text, setText] = useState(task.content);

  const { toggleTask, updateTask } = useNotebook();

  const editTask = async () => {
    await updateTask(task?.id, text);
    setEdit(false);
    setShowNew(text === task.content ? "" : "top");
  };

  useEffect(() => {
    if (edit && inputRef?.current) {
      inputRef.current.focus();
    }
  }, [edit]);

  return (
    <div
      className={`yaba-notebook__tasks--list-item`}
      onClick={() => {
        if (isSelect) {
          if (selected.includes(task?.id)) {
            setSelected(selected.filter(i => i !== task?.id));
          } else {
            setSelected((p: any) => [...p, task?.id]);
          }
        } else {
          setEdit(true);
        }
      }}
      onBlur={e => {
        e.preventDefault();
        editTask();
      }}
    >
      <div className="yaba-notebook__tasks--list-item__inner">
        <button
          data-checked={(isSelect && selected.includes(task?.id)) || task?.done}
          onClick={e => {
            e.preventDefault();

            if (isSelect) {
              if (selected.includes(task?.id)) {
                setSelected(selected.filter(i => i !== task?.id));
              } else {
                setSelected((p: any) => [...p, task?.id]);
              }
            } else {
              toggleTask(task?.id);
            }
          }}
          className="yaba-notebook__tasks--list-item__checkbox"
        >
          <Check size={10} strokeWidth={3.4} />
        </button>

        <div className="yaba-notebook__tasks--list-item__details">
          {!edit ? (
            <h2 className="title">{task?.content}</h2>
          ) : (
            <TextareaAutosize
              minRows={1}
              value={text}
              ref={inputRef}
              placeholder="Edit task..."
              className="text-area"
              onKeyDown={e => {
                if (e.key === "Enter") {
                  if (!e.shiftKey) {
                    e.preventDefault();
                    editTask();
                  }
                }
              }}
              onChange={e => setText(e.target.value)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditableTask;
