import {
  doc,
  writeBatch,
  arrayRemove,
  serverTimestamp,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import dayjs from "dayjs";
import { v4 } from "uuid";
import { useState } from "react";
import { db } from "../../../../fb";
import { useRecoilState, useRecoilValue } from "recoil";
import Icons from "../../../../common/Icons";
import { useNavigate } from "react-router-dom";
import useAppMenu from "../../../../hooks/useAppMenu";
import { spaceTimestampState, UserState } from "../../../../atoms/appState";
import { doubleDigit } from "../../../SetBookmark/helpers";
import _ from "lodash";
import { Bookmark } from "phosphor-react";

const SpaceDetails = ({ space, setModal, setLoading, setLoadingMsg }) => {
  const { bookmark } = space;
  let navigate = useNavigate();
  const user = useRecoilValue(UserState);
  const [imgLoaded, setImgLoaded] = useState(false);

  const [spaceTimestamp, setSpaceTimestampState] =
    useRecoilState(spaceTimestampState);
  const updateTimestamp = async () => {
    const newUpdate = _.omit(spaceTimestamp, [space?.id]);
    setSpaceTimestampState(newUpdate);
  };

  const onSelect = async option => {
    if (option === "open-link") {
      window.open(bookmark?.link, "_blank");
    } else if (option === "exit-worspace" && space?.id && user?.email) {
      setLoading(true);
      setLoadingMsg("Exiting workspace...");

      try {
        const commentId = v4();
        // const batch = writeBatch(db);
        // batch.update(doc(db, "workspaces", space?.id), {
        //   members: arrayRemove(user?.email),
        //   dateUpdated: serverTimestamp(),
        // });

        // batch.set(doc(db, "comments", commentId), {
        //   user,
        //   id: commentId,
        //   type: "member-exit",
        //   workspaceId: space?.id,
        //   dateCreated: serverTimestamp(),
        // });

        await setDoc(
          doc(db, "workspaces", space?.id),
          {
            members: [...space?.members.filter(m => m !== user?.email)],
            dateUpdated: serverTimestamp(),
          },
          {
            merge: true,
          }
        );

        await setDoc(doc(db, "comments", commentId), {
          user,
          id: commentId,
          type: "member-exit",
          workspaceId: space?.id,
          dateCreated: new Date().getTime(),
        });

        await updateTimestamp();
        navigate(-1);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
        setLoadingMsg("");
      }
    } else {
      setModal(option);
    }
  };

  const [AppMenu, activeOption] = useAppMenu(
    "all",
    ["add-member", "participants", "open-link", "exit-worspace"],
    onSelect
  );

  return (
    <div className="space-area__details">
      {bookmark?.image && (
        <div className="space-area__details-media">
          <div className="image-cover">
            <img
              src={bookmark?.image}
              alt=""
              onLoad={e => setImgLoaded(true)}
            />
            {!imgLoaded ? (
              <div className="placeholder">
                <Bookmark size={20} weight="fill" color={"#B3B3B3"} />
              </div>
            ) : null}
          </div>
        </div>
      )}

      <div className="space-area__details__content">
        <div className="space-area__details__bkmk">
          <div className="space-area__details__bkmk-content">
            <p className="space-area__details__bkmk-title">{bookmark?.title}</p>

            {bookmark?.description && (
              <p className="space-area__details__bkmk-description">
                {bookmark?.description}
              </p>
            )}
          </div>

          <AppMenu>
            <button className="space-area__details__bkmk-btn">
              <Icons.dots />
            </button>
          </AppMenu>
        </div>

        <div className="space-area__details__info">
          <p className="space-area__details__info-date">
            <span className="label">Created:&nbsp;</span>
            {dayjs(space?.dateCreated?.toDate()).format("Do MMMM")}
          </p>

          <div className="space-area__details__info-members">
            <span className="label">Members:&nbsp;</span>
            {doubleDigit(space?.members?.length)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceDetails;
