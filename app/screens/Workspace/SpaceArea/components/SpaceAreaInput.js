import {
  doc,
  increment,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import { v4 } from "uuid";
import { useState } from "react";
import { db } from "../../../../fb";
import { useRecoilValue } from "recoil";
import Icons from "../../../../common/Icons";
import { SpinnerCircular } from "spinners-react";
import TextareaAutosize from "react-textarea-autosize";
import { UserState } from "../../../../atoms/appState";

const SpaceAreaInput = ({ space }) => {
  const [error, setError] = useState("");
  const user = useRecoilValue(UserState);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const addComment = async () => {
    setError("");
    if (comment.trim() === "" || loading) return;
    setLoading(true);

    const commentId = v4();

    try {
      const batch = writeBatch(db);
      batch.set(doc(db, "comments", commentId), {
        user,
        id: commentId,
        message: comment,
        workspaceId: space?.id,
        dateCreated: new Date().getTime(),
      });
      batch.update(doc(db, "workspaces", space?.id), {
        dateUpdated: serverTimestamp(),
        messageCount: increment(1),
      });

      await batch.commit();
      setComment("");
    } catch (error) {
      console.log(error);
      setError("Error adding comment. Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-area__input-section">
      <div className="space-area__input-container">
        <div className="space-area__input-cover">
          <TextareaAutosize
            type="text"
            minRows={1}
            maxRows={3}
            value={comment}
            disabled={loading}
            className="space-area-input"
            placeholder="Write a comment..."
            onChange={e => setComment(e.target.value)}
          />
        </div>

        <button className="action-btn" onClick={addComment}>
          {loading ? (
            <SpinnerCircular
              size={16}
              thickness={200}
              color="#245ab0d0"
              secondaryColor="#ddd"
            />
          ) : (
            <Icons.ArrowUp size={12.6} />
          )}
        </button>
      </div>

      {error && <p className="warning">{error}</p>}
    </div>
  );
};

export default SpaceAreaInput;
