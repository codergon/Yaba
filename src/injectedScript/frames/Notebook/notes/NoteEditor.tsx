import {
  Editor,
  Modifier,
  RichUtils,
  EditorState,
  convertFromRaw,
  CompositeDecorator,
} from "draft-js";
import {
  List,
  Bold,
  Link,
  Italic,
  Unlink,
  TextQuote,
  ExternalLink,
} from "lucide-react";
import { useEffect } from "react";
import isURL from "validator/es/lib/isURL";
import { useLocation } from "react-router-dom";
import { ArrowLeft, ListNumbers } from "phosphor-react";
import { useNotebook } from "../components/NotebookProvider";
import { EditorLink, findLinkEntities } from "../utils/editor";

function addProtocolToURL(url: string) {
  if (!/^https?:\/\//i.test(url)) {
    url = "http://" + url;
  }
  return url;
}

const decorator = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: EditorLink,
  },
]);

const NoteEditor = () => {
  const editorIconSize = 13;
  const editorIconStroke = 2.8;

  const { state: data } = useLocation();
  const { saveNote, editorState, setEditorState, resetEditor } = useNotebook();

  const isEditorEmpty = () => {
    const contentState = editorState.getCurrentContent();
    const plainText = contentState.getPlainText("").trim();
    return plainText.length === 0;
  };

  useEffect(() => {
    const rawEditorData = data?.content ? JSON.parse(data?.content) : null;

    if (rawEditorData !== null) {
      const contentState = convertFromRaw(rawEditorData);
      setEditorState(EditorState.createWithContent(contentState, decorator));
    }
  }, [data?.content, setEditorState]);

  const save = async () => await saveNote(data?.id, isEditorEmpty());

  // EDITOR STATE MODIFIERS
  const onBoldClick = () => {
    const newEditorState = RichUtils.toggleInlineStyle(editorState, "BOLD");
    setEditorState(newEditorState);
  };

  const onItalicClick = () => {
    const newEditorState = RichUtils.toggleInlineStyle(editorState, "ITALIC");
    setEditorState(newEditorState);
  };

  const onAddListClick = (newBlockType = "unordered-list-item") => {
    const newEditorState = RichUtils.toggleBlockType(editorState, newBlockType);
    setEditorState(newEditorState);
  };

  const onAddOrdered = () => {
    onAddListClick("ordered-list-item");
  };

  const onAddUnordered = () => {
    onAddListClick("unordered-list-item");
  };

  const onAddBlockquoteClick = () => {
    onAddListClick("blockquote");
  };

  // EDITOR STATE UTILS
  const isSelectionStyled = (style: string) => {
    const currentStyle = editorState.getCurrentInlineStyle();
    return currentStyle.has(style);
  };

  const isSelectionBlockType = (blockType: string) => {
    const selectionState = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const block = contentState.getBlockForKey(selectionState.getStartKey());
    return block.getType() === blockType;
  };

  const isSelectionLink = () => {
    const selectionState = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const blockWithLinkAtBeginning = contentState.getBlockForKey(
      selectionState.getStartKey()
    );
    const linkKey = blockWithLinkAtBeginning.getEntityAt(
      selectionState.getStartOffset()
    );

    return (
      linkKey !== null && contentState.getEntity(linkKey).getType() === "LINK"
    );
  };

  // LINK UTILS
  const onAddLinkClick = (): void => {
    const selectionState = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const blockWithLinkAtBeginning = contentState.getBlockForKey(
      selectionState.getStartKey()
    );
    const linkKey = blockWithLinkAtBeginning.getEntityAt(
      selectionState.getStartOffset()
    );

    if (linkKey) {
      const linkTextLength = blockWithLinkAtBeginning.getText().length;
      const updatedSelectionState = selectionState.merge({
        anchorOffset: 0,
        focusOffset: linkTextLength,
      });

      const updatedContentState = contentState.mergeEntityData(linkKey, {
        url: null,
      });

      const newEditorState = EditorState.push(
        editorState,
        updatedContentState,
        "apply-entity"
      );

      setEditorState(
        RichUtils.toggleLink(newEditorState, updatedSelectionState, null)
      );
    } else if (!selectionState.isCollapsed()) {
      const link = window.prompt("Enter a URL:");
      if (link && isURL(link)) {
        const contentStateWithEntity = contentState.createEntity(
          "LINK",
          "MUTABLE",
          { url: link }
        );
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newEditorState = EditorState.set(editorState, {
          currentContent: contentStateWithEntity,
        });
        setEditorState(
          RichUtils.toggleLink(newEditorState, selectionState, entityKey)
        );
      }
    } else {
      const currentBlock = contentState.getBlockForKey(
        selectionState.getStartKey()
      );
      const blockType = currentBlock.getType();

      if (blockType === "unstyled") {
        const newContentState = Modifier.setBlockType(
          contentState,
          selectionState,
          "unstyled"
        );
        const newEditorState = EditorState.push(
          editorState,
          newContentState,
          "change-block-type"
        );
        setEditorState(newEditorState);
      }
    }
  };

  const onOpenLinkClick = () => {
    const selectionState = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const blockWithLinkAtBeginning = contentState.getBlockForKey(
      selectionState.getStartKey()
    );
    const linkKey = blockWithLinkAtBeginning.getEntityAt(
      selectionState.getStartOffset()
    );

    if (linkKey) {
      const entity = contentState.getEntity(linkKey);
      const { url } = entity.getData();
      window.open(addProtocolToURL(url), "_blank");
    }
  };

  return (
    <>
      <div className="yaba-notebook__notes--header">
        <button
          onClick={() => {
            if (!!data) {
              save();
            } else {
              resetEditor();
            }
          }}
          className="date-back_btn"
        >
          <ArrowLeft size={16} weight="bold" />
          <h1>Back</h1>
        </button>

        <div className="action-btns">
          <button
            className="action-btn"
            disabled={isEditorEmpty() && !data}
            style={{
              opacity: isEditorEmpty() && !data ? 0.7 : 1,
            }}
            onClick={save}
          >
            Save
          </button>
        </div>
      </div>

      <div className="yaba-notebook__notes--editor">
        <div className="editor-btns__container">
          <div className="editor-btns">
            {[
              {
                label: "bold",
                onclick: onBoldClick,
                icon: (
                  <Bold size={editorIconSize} strokeWidth={editorIconStroke} />
                ),
              },
              {
                label: "quote",
                onclick: onAddBlockquoteClick,
                icon: (
                  <TextQuote
                    size={editorIconSize + 2}
                    strokeWidth={editorIconStroke}
                  />
                ),
              },
              {
                label: "italic",
                onclick: onItalicClick,
                icon: (
                  <Italic
                    size={editorIconSize}
                    strokeWidth={editorIconStroke}
                  />
                ),
              },
              {
                label: "unordered",
                onclick: onAddUnordered,
                icon: (
                  <List
                    size={editorIconSize + 2}
                    strokeWidth={editorIconStroke}
                  />
                ),
              },
              {
                label: "ordered",
                onclick: onAddOrdered,
                icon: <ListNumbers size={editorIconSize + 3} weight="bold" />,
              },
              {
                label: "link",
                onclick: onAddLinkClick,
                icon: (
                  <Link size={editorIconSize} strokeWidth={editorIconStroke} />
                ),
                altIcon: (
                  <Unlink
                    size={editorIconSize}
                    strokeWidth={editorIconStroke}
                  />
                ),
              },
            ].map(slug => {
              return (
                <button
                  key={slug?.label}
                  className="editor-btn"
                  data-active={
                    (slug?.label === "bold" && isSelectionStyled("BOLD")) ||
                    (slug?.label === "italic" && isSelectionStyled("ITALIC")) ||
                    (slug?.label === "ordered" &&
                      isSelectionBlockType("ordered-list-item")) ||
                    (slug?.label === "unordered" &&
                      isSelectionBlockType("unordered-list-item")) ||
                    (slug?.label === "unordered" &&
                      isSelectionBlockType("unordered-list-item")) ||
                    (slug?.label === "quote" &&
                      isSelectionBlockType("blockquote")) ||
                    (slug?.label === "link" && isSelectionLink())
                  }
                  onClick={slug?.onclick}
                >
                  {slug?.label === "link" && isSelectionLink()
                    ? slug?.altIcon
                    : slug?.icon}
                </button>
              );
            })}
          </div>

          {isSelectionLink() && (
            <button
              className="editor-btn external-link"
              onClick={onOpenLinkClick}
            >
              <ExternalLink
                size={editorIconSize}
                strokeWidth={editorIconStroke}
              />
            </button>
          )}
        </div>

        <div className="editor-container">
          <div className="editor-container__inner">
            <Editor
              editorState={editorState}
              onChange={setEditorState}
              placeholder="Start writing..."
              handleKeyCommand={command => {
                const newState = RichUtils.handleKeyCommand(
                  editorState,
                  command
                );

                if (newState) {
                  setEditorState(newState);
                  return "handled";
                }

                return "not-handled";
              }}
              handleReturn={(event, newEditorState) => {
                if (event.ctrlKey) {
                  const contentState = newEditorState.getCurrentContent();
                  const selectionState = newEditorState.getSelection();
                  const startKey = selectionState.getStartKey();
                  const endKey = selectionState.getEndKey();
                  const startOffset = selectionState.getStartOffset();
                  const endOffset = selectionState.getEndOffset();
                  const startBlock = contentState.getBlockForKey(startKey);
                  const endBlock = contentState.getBlockForKey(endKey);

                  if (
                    startBlock.getType() === "code-block" &&
                    endBlock.getType() === "code-block" &&
                    startOffset === 0 &&
                    endOffset === 0
                  ) {
                    const newContentState = contentState.createEntity(
                      "CODE",
                      "MUTABLE"
                    );
                    const entityKey = newContentState.getLastCreatedEntityKey();
                    const newText = `\n\n\`\`\`\n\n\`\`\`\n\n`;
                    const newState = EditorState.push(
                      newEditorState,
                      Modifier.insertText(
                        newContentState,
                        selectionState,
                        newText,
                        undefined,
                        entityKey
                      ),
                      "insert-characters"
                    );
                    setEditorState(newState);
                    return "handled";
                  }
                }
                return "not-handled";
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default NoteEditor;
