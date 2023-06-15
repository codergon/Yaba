import { useNavigate } from "react-router-dom";
import { EditorLink, findLinkEntities } from "../utils/editor";
import { CompositeDecorator, EditorState, convertToRaw } from "draft-js";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export interface NoteType {
  id: string;
  date?: number;
  content?: any;
  title?: string;
}

export interface TaskType {
  id: string;
  date?: number;
  content?: any;
  done: boolean;
}

type ContextType = {
  notes: NoteType[];
  resetEditor: () => void;
  editorState: EditorState;
  setEditorState: (state: EditorState) => void;
  deleteNotes: (noteIds: string[]) => Promise<void>;
  saveNote: (noteId: string, isEmpty: boolean) => Promise<void>;

  tasks: TaskType[];
  lastIndex: number;
  activeTasks: TaskType[];
  completedTasks: TaskType[];
  setTasks: (tasks: TaskType[]) => void;
  setLastIndex: (index: number) => void;
  toggleTask: (taskId: string) => Promise<void>;
  deleteTasks: (taskIds: string[]) => Promise<void>;
  updateTask: (taskId: string, content: any) => Promise<void>;
  saveTask: (text: string, id?: string, done?: boolean) => Promise<void>;
};

export const NotebookContext = createContext<ContextType>({
  notes: [],
  resetEditor: () => {},
  setEditorState: () => {},
  editorState: EditorState.createEmpty(),
  saveNote: async () => Promise.resolve(),
  deleteNotes: async () => Promise.resolve(),

  tasks: [],
  lastIndex: 0,
  activeTasks: [],
  completedTasks: [],
  setTasks: () => {},
  setLastIndex: () => {},
  saveTask: async () => Promise.resolve(),
  toggleTask: async () => Promise.resolve(),
  updateTask: async () => Promise.resolve(),
  deleteTasks: async () => Promise.resolve(),
});

interface NotebookProviderProps {
  children: React.ReactElement | React.ReactElement[];
}

const decorator = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: EditorLink,
  },
]);

export default function NotebookProvider({ children }: NotebookProviderProps) {
  const navigation = useNavigate();
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [notes, setNotes] = useState<NoteType[]>([]);

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(decorator)
  );

  const setup = async () => {};

  useEffect(() => {
    setup();
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible") {
        await setup();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // TASKS FUNCTIONS
  const [lastIndex, setLastIndex] = useState(0);

  const saveTask = async (text = "", id = "", done = false) => {
    if (!text) return;

    const task: TaskType = {
      done,
      content: text,
      date: Date.now(),
      id: id || crypto.randomUUID(),
    };

    if (lastIndex === 0) {
      setTasks(p => [task, ...p]);
      setLastIndex(1);
    } else {
      setTasks(p => {
        const newTasks = [...p];
        newTasks.splice(lastIndex, 0, task);
        return newTasks;
      });
      setLastIndex(p => p + 1);
    }
  };

  const toggleTask = async (taskId: string) => {
    const newList = tasks.filter(element => element.id !== taskId);
    const item = tasks.find(element => element.id === taskId);
    const firstDoneIndex = newList.findIndex(element => element.done);

    if (item) {
      newList.splice(
        firstDoneIndex === -1 ? newList.length : firstDoneIndex,
        0,
        {
          ...item,
          date: Date.now(),
          done: !item.done,
        }
      );

      setTasks(newList);
    }
  };

  const updateTask = async (taskId: string, content: "") => {
    const itemIndex = tasks.findIndex(element => element.id === taskId);
    setTasks(p =>
      p.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            content,
          };
        } else {
          return t;
        }
      })
    );
    setLastIndex(p => (itemIndex === 0 ? 1 : itemIndex + 1));
  };

  const deleteTasks = async (taskIds: string[]) => {
    setTasks((p: any) => p.filter((i: any) => !taskIds.includes(i.id)));
  };

  const activeTasks = useMemo(() => {
    return tasks.filter((i: any) => !i.done);
  }, [tasks]);

  const completedTasks = useMemo(() => {
    return tasks.filter((i: any) => i.done);
  }, [tasks]);

  // NOTES FUNCTIONS
  const resetEditor = () => {
    setEditorState(EditorState.createEmpty(decorator));
    navigation("/");
  };

  const saveNote = async (noteId: string, isEmpty: boolean) => {
    if (isEmpty && !noteId) return;

    if (isEmpty && noteId) {
      setNotes((p: any) => p.filter((i: any) => i.id !== noteId));
    } else if (!isEmpty && !noteId) {
      const raw = convertToRaw(editorState.getCurrentContent());
      const note = {
        date: Date.now(),
        id: crypto.randomUUID(),
        title: raw.blocks[0].text,
        content: JSON.stringify(raw),
      };
      setNotes((p: any) => [note, ...p]);
    } else if (!isEmpty && noteId) {
      const raw = convertToRaw(editorState.getCurrentContent());
      const note = {
        date: Date.now(),
        id: noteId,
        title: raw.blocks[0].text,
        content: JSON.stringify(raw),
      };
      setNotes((p: any) => [note, ...p.filter((i: any) => i.id !== noteId)]);
    }
    resetEditor();
  };

  const deleteNotes = async (notes: string[]) => {
    setNotes((p: any) => p.filter((i: any) => !notes.includes(i.id)));
  };

  return (
    <NotebookContext.Provider
      value={{
        notes,
        saveNote,
        editorState,
        deleteNotes,
        resetEditor,
        setEditorState,

        tasks,
        saveTask,
        setTasks,
        lastIndex,
        toggleTask,
        updateTask,
        deleteTasks,
        activeTasks,
        setLastIndex,
        completedTasks,
      }}
    >
      {children}
    </NotebookContext.Provider>
  );
}

export function useNotebook() {
  return useContext(NotebookContext);
}
