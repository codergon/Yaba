import NewTask from "./NewTask";
import { Fragment } from "react";
import ActiveTask from "./ActiveTask";
import { useNotebook } from "../components/NotebookProvider";
import { Droppable, DropResult, DragDropContext } from "react-beautiful-dnd";

interface ActiveTasksTaskProps {
  showNew: string;
  isSelect: boolean;
  selected: string[];
  setShowNew: (value: any) => void;
  setSelected: (value: any) => void;
}

const ActiveTasks = ({
  showNew,
  isSelect,
  selected,
  setShowNew,
  setSelected,
}: ActiveTasksTaskProps) => {
  const { setTasks, lastIndex, activeTasks, completedTasks } = useNotebook();

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    const updatedActiveTasks = Array.from(activeTasks);
    const [removed] = updatedActiveTasks.splice(result.source.index, 1);
    updatedActiveTasks.splice(result.destination.index, 0, removed);
    setTasks([...updatedActiveTasks, ...completedTasks]);
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="completedTasks">
          {(provided: any) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="yaba-notebook__tasks--list__section"
            >
              {activeTasks.map((task, index) => {
                return (
                  <Fragment key={task.id}>
                    {lastIndex === 0 && index === 0 && !!showNew && (
                      <NewTask setShowNew={setShowNew} />
                    )}

                    <ActiveTask
                      task={task}
                      index={index}
                      enabled={showNew}
                      isSelect={isSelect}
                      selected={selected}
                      setShowNew={setShowNew}
                      setSelected={setSelected}
                    />

                    {lastIndex - 1 === index && !!showNew && (
                      <NewTask setShowNew={setShowNew} />
                    )}
                  </Fragment>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};

export default ActiveTasks;
