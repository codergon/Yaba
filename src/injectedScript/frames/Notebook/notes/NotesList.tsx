import Note from "./Note";
import dayjs from "dayjs";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NewButton from "../components/NewButton";
import Emptystate from "../components/emptystate";
import { NoteType, useNotebook } from "../components/NotebookProvider";
import { X } from "phosphor-react";

const NotesList = () => {
  const navigate = useNavigate();
  const { notes, deleteNotes } = useNotebook();
  const [isSelect, setIsSelect] = useState(false);
  const [selected, setSelected] = useState<any[]>([]);

  const openNote = (note?: NoteType) => {
    navigate("./editor", {
      state: note,
    });
  };

  return (
    <>
      <div className="yaba-notebook__notes--header">
        <h1>{dayjs().format("dddd, MMMM D")}</h1>

        <div className="action-btns">
          {notes?.length > 0 ? (
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
                    await deleteNotes(selected);
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
              onClick={e => openNote()}
            >
              New Note
            </button>
          )}
          {/* 
          <button className="action-btn close-btn" onClick={e => {}}>
            <X size={12} weight="bold" />
          </button> */}
        </div>
      </div>

      {notes?.length > 0 && <NewButton createNew={openNote} />}

      {notes?.length > 0 ? (
        <div className="yaba-notebook__notes--list">
          {notes.map((note, index) => {
            return (
              <Note
                item={note}
                key={index}
                openNote={openNote}
                isSelect={isSelect}
                selected={selected}
                setSelected={setSelected}
              />
            );
          })}
        </div>
      ) : (
        <Emptystate imageIndex={0} />
      )}
    </>
  );
};

export default NotesList;
