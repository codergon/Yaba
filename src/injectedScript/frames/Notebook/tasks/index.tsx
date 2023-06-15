import dayjs from "dayjs";
import Task from "./Task";
import NewTask from "./NewTask";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import ActiveTasks from "./ActiveTasks";
import NewButton from "../components/NewButton";
import Emptystate from "../components/emptystate";
import { useNotebook } from "../components/NotebookProvider";

const Tasks = () => {
  const [showNew, setShowNew] = useState("");
  const [isSelect, setIsSelect] = useState(false);
  const [selected, setSelected] = useState<any[]>([]);
  const { tasks, activeTasks, deleteTasks, completedTasks } = useNotebook();

  return (
    <div className="yaba-notebook__tasks">
      <div className="yaba-notebook__tasks--header">
        <h1>{dayjs().format("dddd, MMMM D")}</h1>

        <div className="action-btns">
          {tasks?.length > 0 ? (
            <>
              <button
                className="action-btn"
                data-delete={isSelect}
                data-vector={isSelect}
                style={{
                  opacity: selected?.length === 0 && isSelect ? 0.5 : 1,
                }}
                onClick={async e => {
                  if (!isSelect) {
                    setIsSelect(true);
                  } else {
                    await deleteTasks(selected);
                    setSelected([]);
                    setIsSelect(false);
                  }
                }}
              >
                {isSelect ? <Trash2 size={15} /> : "Select"}
              </button>

              {isSelect && (
                <button
                  className="action-btn"
                  data-delete={isSelect}
                  onClick={e => {
                    setSelected([]);
                    setIsSelect(false);
                  }}
                >
                  Cancel
                </button>
              )}
            </>
          ) : (
            <button
              className="action-btn"
              style={{
                opacity: selected?.length === 0 && isSelect ? 0.5 : 1,
              }}
              onClick={e => setShowNew("bottom")}
            >
              New Task
            </button>
          )}
        </div>
      </div>

      {tasks?.length > 0 && (
        <NewButton
          createNew={() =>
            setShowNew(activeTasks?.length > 0 ? "top" : "bottom")
          }
        />
      )}

      {tasks?.length > 0 || !!showNew ? (
        <>
          <div className="yaba-notebook__tasks--list">
            <ActiveTasks
              {...{
                isSelect,
                selected,
                setSelected,
                setShowNew,
                showNew,
              }}
            />

            {activeTasks?.length === 0 && !!showNew && (
              <NewTask setShowNew={setShowNew} />
            )}

            {completedTasks?.length > 0 && (
              <div className="yaba-notebook__tasks--list-header">
                <div className="yaba-notebook__tasks--list-header__inner">
                  <h1>Completed</h1>
                  <h1 className="count">{completedTasks?.length}</h1>
                </div>
              </div>
            )}

            {completedTasks.map(task => (
              <Task
                item={task}
                key={task.id}
                isSelect={isSelect}
                selected={selected}
                setSelected={setSelected}
              />
            ))}
          </div>
        </>
      ) : (
        <Emptystate isTasks />
      )}
    </div>
  );
};

export default Tasks;
