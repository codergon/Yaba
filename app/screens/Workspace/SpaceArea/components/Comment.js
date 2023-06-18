import dayjs from "dayjs";
import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import Vectors from "../../../../common/Vectors";
import { UserState } from "../../../../atoms/appState";

const Comment = ({ comment }) => {
  const { user } = comment;
  const currentUser = useRecoilValue(UserState);
  const [imgLoaded, setImgLoaded] = useState(false);

  // Seperate the user name into first and last name
  const userName = user?.name?.split(" ");

  return (
    <div
      className={`space-area__comment${
        currentUser?.uid !== user?.uid ? "" : " other-user"
      }`}
    >
      {currentUser?.uid !== user?.uid && (
        <div className="space-area__comment-media">
          {user?.photoURL && false ? (
            <div className="image-cover">
              <img
                src={user?.photoURL}
                alt=""
                onLoad={e => setImgLoaded(true)}
              />
              {!imgLoaded && (
                <div className="placeholder">
                  <Vectors.user />
                </div>
              )}
            </div>
          ) : (
            <Vectors.user />
          )}
        </div>
      )}

      <div className="space-area__comment__content">
        {currentUser?.uid !== user?.uid && (user?.name || user?.email) && (
          <div className="space-area__comment__content-header">
            <p className="space-area__comment__content-header-name">
              {userName
                ? (userName[1] || userName[0]) +
                  (userName[1] ? " " + userName[0][0] + "." : "")
                : user?.email}
            </p>
          </div>
        )}

        <div className="space-area__comment__content-body">
          <p className="space-area__comment__content-body-text">
            {comment?.message}
          </p>
        </div>

        <div className="space-area__comment__content-footer">
          <div />
          <p className="space-area__comment__content-footer-date">
            {dayjs(comment?.dateCreated).format("HH:mm")}
          </p>
        </div>
      </div>

      {/*  */}
    </div>
  );
};

export default Comment;
