import Notes from "../notes";
import Tasks from "../tasks";
import Navbar from "./navbar";
import NotesList from "../notes/NotesList";
import NoteEditor from "../notes/NoteEditor";
import NotebookProvider from "./NotebookProvider";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";

const Tabs = () => {
  return (
    <>
      <Router>
        <NotebookProvider>
          <div className="yaba-notebook__tabs">
            <Routes>
              <Route path="/" element={<Notes />}>
                <Route index element={<NotesList />} />
                <Route path="editor" element={<NoteEditor />} />
              </Route>

              <Route path="/tasks" element={<Tasks />} />
            </Routes>
          </div>

          <Navbar />
        </NotebookProvider>
      </Router>
    </>
  );
};

export default Tabs;
