import { Check } from "lucide-react";
import { Draggable } from "react-beautiful-dnd";
import { useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { TaskType, useNotebook } from "../components/NotebookProvider";

interface ActiveTaskProps {
  index: number;
  task: TaskType;
  enabled: string;
  isSelect: boolean;
  selected: string[];
  setShowNew: (value: any) => void;
  setSelected: (value: any) => void;
}

const ActiveTask = ({
  task,
  index,
  enabled,
  isSelect,
  selected,
  setShowNew,
  setSelected,
}: ActiveTaskProps) => {
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
    <Draggable index={index} draggableId={task.id} isDragDisabled={!!enabled}>
      {(provided: any, snapshot: any) => {
        var transform = provided.draggableProps.style.transform;
        try {
          if (transform) {
            var size = Math.max(Math.min(36 * 5 * (index / 5), 36 * 5), 36);
            var invSize = Math.max(36 * 5 * ((5 - index) / 5), 36);
            var t = transform.split(",")[1];
            var yNum = t.split("px")[0];
            var yVal = parseInt(yNum);
            var y = yVal <= -size ? -size : yVal >= invSize ? invSize : yVal;
            provided.draggableProps.style.transform =
              "translate(0px," + y + "px)";
          }
        } catch (e) {}

        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <div
              className={`yaba-notebook__tasks--list-item ${
                snapshot.isDragging ? "dragging" : ""
              }`}
              onClick={() => setEdit(true)}
              onBlur={e => {
                e.preventDefault();
                editTask();
              }}
            >
              <div className="yaba-notebook__tasks--list-item__inner">
                <button
                  data-checked={
                    (isSelect && selected.includes(task?.id)) || task?.done
                  }
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
          </div>
        );
      }}
    </Draggable>
  );
};

export default ActiveTask;
