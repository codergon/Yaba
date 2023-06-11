import React, { useState } from "react";
import { useRecoilState } from "recoil";
import Icons from "../../common/Icons";
import { categoriesDataState } from "../../atoms/appState";

const Categories = ({
  setCategories,
  categoriesRef,
  setOpenCategories,
  showInput,
  label,
}) => {
  const [categInput, setCategInput] = useState("");
  const [catExists, setCatExists] = useState(false);
  const [validCateg, setValidCateg] = useState(true);
  const [showCategInp, setShowCategInp] = useState(false);
  const [categoriesData, setCategoriesData] =
    useRecoilState(categoriesDataState);

  const [tempList, setTempList] = useState([]);

  const handleChange = category => {
    if (tempList.includes(category)) {
      setTempList(p => p.filter(c => c !== category));
    } else {
      setTempList(p => [...p, category]);
    }
  };

  const updateCategs = () => {
    setCategories(tempList);
    setOpenCategories(false);
  };

  const addToCategories = () => {
    const exists = categoriesData?.filter(
      cat => cat.toLowerCase() === categInput.trim().toLowerCase()
    ).length;
    if (exists > 0) {
      setCatExists(true);
      return;
    } else {
      setCatExists(false);
    }

    if (categInput.trim().length < 3) {
      setValidCateg(false);
      return;
    } else {
      setValidCateg(true);
    }

    const newList = [...(categoriesData || []), categInput].sort((a, b) => {
      if (a.toLowerCase() < b.toLowerCase()) {
        return -1;
      }
      if (a.toLowerCase() > b.toLowerCase()) {
        return 1;
      }
      return 0;
    });

    setCategoriesData(newList);
    setShowCategInp(false);
    setCategInput("");
  };

  return (
    <div className="yaba-app-modal">
      <div className="yaba-app-modal-content" ref={categoriesRef}>
        <div className="yaba-app-modal-content-header">
          <button data-active={false}>
            <Icons.arrowLeft />
          </button>
          <p>Add to category</p>

          <button className="sm-icon" onClick={e => setOpenCategories(false)}>
            <Icons.close />
          </button>
        </div>

        {categoriesData?.length > 0 && (
          <ul>
            {categoriesData?.map((option, index) => {
              return (
                <li
                  key={index}
                  className="category"
                  onClick={e => handleChange(option)}
                >
                  <Icons.checkBox checked={tempList.includes(option)} />
                  <p>{option}</p>
                </li>
              );
            })}
          </ul>
        )}

        {showInput !== false && (
          <div className="add-category-container ">
            <div
              className="label"
              onClick={e => {
                setCategInput("");
                setShowCategInp(p => !p);
              }}
            >
              <p>Add new category</p>
              {Icons[showCategInp ? "caretup" : "caretdown"]({
                elemClass: "stroke",
              })}
            </div>

            {showCategInp && (
              <>
                <div className="add-category">
                  <input
                    type="text"
                    value={categInput}
                    placeholder="Input category"
                    onChange={e => setCategInput(e.target.value)}
                  />
                  <button onClick={addToCategories}>Add category</button>
                </div>

                {!validCateg && (
                  <p className="inValidCateg">
                    Ensure input length is min of 3 and max of 12
                  </p>
                )}
                {catExists && <p className="inValidCateg">Category exists</p>}
              </>
            )}
          </div>
        )}

        <button className="set-reminder-btn" onClick={updateCategs}>
          {label || "Done"}
        </button>
      </div>
    </div>
  );
};

export default Categories;
