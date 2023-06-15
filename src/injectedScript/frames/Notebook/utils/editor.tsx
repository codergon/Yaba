import React from "react";

export const EditorLink: React.FC<any> = props => {
  return (
    <span
      style={{
        color: "blue",
        textDecoration: "underline",
      }}
    >
      {props.children}
    </span>
  );
};

export const findLinkEntities = (
  contentBlock: any,
  callback: any,
  contentState: any
) => {
  contentBlock.getCharacterList().forEach((character: any, offset: number) => {
    const entityKey = character.getEntity();
    if (entityKey) {
      const entity = contentState.getEntity(entityKey);
      if (entity.getType() === "LINK") {
        callback(offset, offset + 1);
      }
    }
  });
};
