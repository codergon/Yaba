import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useNotebook } from "../components/NotebookProvider";

interface NewTaskProps {
  setShowNew: (value: string) => void;
}

const NewTask = ({ setShowNew }: NewTaskProps) => {
  const inputRef = useRef<any>(null);
  const [text, setText] = useState("");
  const [selected, setSelected] = useState(false);

  const { tasks, saveTask, setLastIndex } = useNotebook();

  const addText = async (blur = false) => {
    await saveTask(text);

    if (tasks?.length === 0 && !text) {
      return;
    } else {
      setText("");
      if (blur || !text) {
        setLastIndex(0);
        setShowNew("");
      }
    }
  };

  useEffect(() => {
    if (inputRef?.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div
      onBlur={e => addText(true)}
      className="yaba-notebook__tasks--list-item newtask"
    >
      <div className="yaba-notebook__tasks--list-item__inner">
        <button
          data-checked={selected}
          onClick={e => setSelected(p => !p)}
          className="yaba-notebook__tasks--list-item__checkbox"
        >
          <Check size={10} strokeWidth={3.4} />
        </button>

        <div className="yaba-notebook__tasks--list-item__details">
          <TextareaAutosize
            minRows={1}
            value={text}
            ref={inputRef}
            placeholder="Add a task..."
            className="text-area"
            onKeyDown={e => {
              if (e.key === "Enter") {
                if (!e.shiftKey) {
                  e.preventDefault();
                  addText();
                }
              }
            }}
            onChange={e => setText(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default NewTask;
