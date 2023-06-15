import { useEffect, useState } from "react";

const Highlighter = () => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    document.addEventListener("mouseup", handleHighlight);
    loadComments();
    return () => {
      document.removeEventListener("mouseup", handleHighlight);
    };
  }, []);

  useEffect(() => {
    highlightSavedText();
  }, [comments]);

  const handleHighlight = () => {
    const highlightedText = window.getSelection().toString().trim();
    if (highlightedText !== "") {
      const span = document.createElement("span");
      const commentId = "larave-" + generateId();
      span.id = commentId;
      span.style.backgroundColor = "yellow";
      span.textContent = highlightedText;
      span.addEventListener("mouseenter", () => showComment(commentId, span));
      span.addEventListener("mouseleave", () => hideComment(commentId));

      const range = window.getSelection().getRangeAt(0);
      range.deleteContents();
      range.insertNode(span);
      showInputPopup(span);
    }
  };

  const showInputPopup = span => {
    const inputPopup = document.createElement("div");
    inputPopup.innerHTML = `
      <input type="text" id="commentInput" placeholder="Enter comment">
      <button id="saveButton">Save</button>
      <button id="cancelButton">Cancel</button>
    `;
    inputPopup.style.position = "absolute";
    inputPopup.style.top = `${
      span.getBoundingClientRect().top + window.scrollY
    }px`;
    inputPopup.style.left = `${
      span.getBoundingClientRect().right + window.scrollX
    }px`;
    inputPopup.style.backgroundColor = "white";
    inputPopup.style.border = "1px solid black";
    inputPopup.style.padding = "10px";
    document.body.appendChild(inputPopup);

    const saveButton = document.getElementById("saveButton");
    const cancelButton = document.getElementById("cancelButton");
    const commentInput = document.getElementById("commentInput");

    saveButton.addEventListener("click", () => {
      const comment = commentInput.value.trim();
      if (comment !== "") {
        const currentURL = window.location.href;
        setComments(prevComments => [
          ...prevComments,
          { id: commentId, comment, url: currentURL },
        ]);
        saveComments();
        console.log("Comment saved:", comment);
      } else {
        removeHighlight(span);
      }
      inputPopup.remove();
    });

    cancelButton.addEventListener("click", () => {
      removeHighlight(span);
      inputPopup.remove();
    });
  };

  const removeHighlight = span => {
    setComments(prevComments =>
      prevComments.filter(comment => comment.id !== span.id)
    );
    span.outerHTML = span.textContent;
    saveComments();
  };

  const showComment = (commentId, span) => {
    const comment = comments.find(comment => comment.id === commentId);
    if (comment) {
      let commentText = document.querySelector(
        `div[data-comment="${commentId}"]`
      );
      if (commentText) {
        commentText.style.display = "block";
        return;
      }

      commentText = document.createElement("div");
      commentText.innerHTML = comment.comment;
      commentText.setAttribute("data-comment", commentId);
      commentText.style.position = "absolute";
      commentText.style.top = `${event.clientY + window.scrollY}px`;
      commentText.style.left = `${event.clientX + window.scrollX}px`;
      commentText.style.backgroundColor = "white";
      commentText.style.border = "1px solid black";
      commentText.style.padding = "10px";

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => {
        removeComment(commentId, span);
        commentText.remove();
      });
      commentText.appendChild(deleteButton);

      document.body.appendChild(commentText);
    }
  };

  const removeComment = (commentId, span) => {
    setComments(prevComments =>
      prevComments.filter(comment => comment.id !== commentId)
    );
    span.style.backgroundColor = "";
    saveComments();
  };

  const hideComment = commentId => {
    const commentText = document.querySelector(
      `div[data-comment="${commentId}"]`
    );
    if (commentText) {
      commentText.style.display = "none";
    }
  };

  const saveComments = () => {
    chrome.storage.local.set({ comments }, () => {
      console.log("Comments saved to storage:", comments);
    });
  };

  const loadComments = () => {
    const currentURL = window.location.href;
    chrome.storage.local.get(["comments"], result => {
      const savedComments = result.comments || [];
      const urlComments = savedComments.filter(
        comment => comment.url === currentURL
      );
      setComments(urlComments);
    });
  };

  const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const highlightSavedText = () => {
    comments.forEach(comment => {
      const { id, url } = comment;
      if (url === window.location.href) {
        const span = document.createElement("span");
        span.id = id;
        span.style.backgroundColor = "yellow";
        span.style.cursor = "pointer";

        const textNodes = document.evaluate(
          `//text()[contains(., "${comment.comment}")]`,
          document,
          null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null
        );

        for (let i = 0; i < textNodes.snapshotLength; i++) {
          const textNode = textNodes.snapshotItem(i);
          const range = document.createRange();
          range.selectNodeContents(textNode);
          const rects = range.getClientRects();

          for (let j = 0; j < rects.length; j++) {
            const rect = rects[j];
            if (rect.width > 0 && rect.height > 0) {
              const clonedSpan = span.cloneNode();
              clonedSpan.style.top = `${rect.top + window.scrollY}px`;
              clonedSpan.style.left = `${rect.left + window.scrollX}px`;
              clonedSpan.style.width = `${rect.width}px`;
              clonedSpan.style.height = `${rect.height}px`;
              clonedSpan.addEventListener("mouseenter", () =>
                showComment(id, clonedSpan)
              );
              clonedSpan.addEventListener("mouseleave", () => hideComment(id));
              document.body.appendChild(clonedSpan);
            }
          }
        }
      }
    });
  };

  return null; // React component must return a single element
};

// const app = document.createElement("div");
// app.id = "my-extension-root";
// document.body.appendChild(app);

// ReactDOM.render(<Highlighter />, document.getElementById("my-extension-root"));

chrome.runtime.onMessage.addListener(message => {
  if (message === "show-comments") {
    chrome.storage.local.get(["comments"], result => {
      const savedComments = result.comments || [];
      const currentURL = window.location.href;
      const urlComments = savedComments.filter(
        comment => comment.url === currentURL
      );
      console.log("Saved comments for current URL:", urlComments);
      // Display comments or perform any action here
    });
  }
});

export default Highlighter;
