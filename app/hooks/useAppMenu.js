import { useState } from "react";
import { Menu, MenuItem } from "@szhsin/react-menu";

const useAppMenu = (defaultOption = null, items, onSelect) => {
  const [activeOption, setActiveOption] = useState(defaultOption || items[0]);

  const AppMenu = ({
    children,
    textAlign = "start",
    menuClass = "app-menu",
  }) => {
    return (
      <div className="app-menu__container">
        <Menu
          align="end"
          transition
          menuButton={children}
          menuClassName={menuClass}
          onItemClick={e => {
            setActiveOption(e.value);
            onSelect(e.value);
          }}
        >
          {items?.map((slug, ind) => (
            <MenuItem
              data-active={slug === activeOption}
              value={slug}
              key={ind}
              className="menu-item"
              style={{ textAlign }}
            >
              <p
                style={{
                  color: slug === "delete" ? "#e16a58" : "inherit",
                }}
              >
                {slug.replace("-", " ")}
              </p>
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  };

  return [AppMenu, activeOption];
};

export default useAppMenu;
