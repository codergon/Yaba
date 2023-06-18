import _ from "lodash";
import dayjs from "dayjs";
import "./spacearea.scss";
import { db } from "../../../fb";
import SpaceModal from "./SpaceModal";
import Comment from "./components/Comment";
import { useLocation } from "react-router-dom";
import DateHeader from "./components/DateHeader";
import EmptyState from "../../../common/EmptyState";
import SpaceDetails from "./components/SpaceDetails";
import { useRecoilState, useRecoilValue } from "recoil";
import SpaceAreaInput from "./components/SpaceAreaInput";
import MemberActionBar from "./components/MemberActionBar";
import SpaceAreaHeader from "./components/SpaceAreaHeader";
import { createRef, Fragment, useEffect, useState } from "react";
import { spaceTimestampState, UserState } from "../../../atoms/appState";
import { collection, onSnapshot, query, where } from "firebase/firestore";

const SpaceArea = () => {
  const { state: spaceData } = useLocation();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState({});
  const [loadingMsg, setLoadingMsg] = useState("");

  const [modal, setModal] = useState(null);

  const [spaceTimestamp, setSpaceTimestampState] =
    useRecoilState(spaceTimestampState);
  const updateTimestamp = async () => {
    const now = new Date().getTime();

    const newUpdate = !spaceTimestamp
      ? {
          [spaceData?.id]: now,
        }
      : {
          ...spaceTimestamp,
          [spaceData?.id]: now,
        };

    setSpaceTimestampState(newUpdate);
  };

  useEffect(() => {
    if (!spaceData?.id) return;
    if (Boolean(comments.length > 0)) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const q = query(
      collection(db, "comments"),
      where("workspaceId", "==", spaceData?.id)
    );

    let unsub;

    try {
      unsub = onSnapshot(q, snapshot => {
        let cmmts = [];
        snapshot.docs.forEach(doc => {
          cmmts.push(doc.data());
        });
        const groupedCmmts = _.chain(cmmts)
          .groupBy(comment => {
            return dayjs(comment?.dateCreated).format("YYYY-MM-DD");
          })
          .value();
        setComments(groupedCmmts);
        updateTimestamp();
        setLoading(false);
        setError("");
      });
    } catch (error) {
      setError(error?.message);
    }

    return () => typeof unsub === "function" && unsub();
  }, [spaceData?.id]);

  //  SCROLL TO BOTTOM LOGIC
  const bottomRef = createRef();
  const [loaded, setLoaded] = useState(false);
  const currentUser = useRecoilValue(UserState);

  const ScrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    if (!loading && Boolean(Object?.keys(comments)?.length > 0) && !loaded) {
      ScrollToBottom();
      setLoaded(true);
    }

    if (loaded && Boolean(Object?.keys(comments)?.length > 0)) {
      const srtd = Object.keys(comments).sort();
      const lastRef = comments[srtd[srtd.length - 1]]?.sort((a, b) =>
        Number(b?.dateCreated) > Number(a?.dateCreated) ? -1 : 0
      );
      const lastMsg = lastRef[lastRef.length - 1];

      const sender = currentUser?.uid === lastMsg?.user?.uid;

      if (sender) ScrollToBottom();
    }
  }, [comments]);

  return (
    <>
      {modal && (
        <SpaceModal screen={modal} space={spaceData} setScreen={setModal} />
      )}

      <SpaceAreaHeader />
      <div className="space-area">
        <SpaceDetails
          space={spaceData}
          setModal={setModal}
          setLoading={setLoading}
          setLoadingMsg={setLoadingMsg}
        />

        {loading ? (
          <EmptyState title={loadingMsg || "Fetching Comments..."} />
        ) : error ? (
          <EmptyState
            isError
            title={"Error fetching comments"}
            description={error}
          />
        ) : (
          <>
            <div className="space-area__comment-items">
              {Boolean(Object.keys(comments)?.length === 0) ? (
                <>
                  <DateHeader date={dayjs().format("YYYY-MM-DD")} />
                </>
              ) : (
                Object.keys(comments)
                  .sort()
                  ?.map((key, index) => (
                    <Fragment key={index}>
                      <DateHeader date={key} />
                      {comments[key]
                        ?.sort((a, b) =>
                          Number(b?.dateCreated) > Number(a?.dateCreated)
                            ? -1
                            : 0
                        )
                        ?.map((comment, ind) => {
                          return comment?.type === "member-exit" ||
                            comment?.type === "member-join" ||
                            comment?.type === "member-added" ? (
                            <MemberActionBar
                              key={ind}
                              type={comment?.type}
                              userCount={comment?.userCount || 0}
                              user={comment?.user?.name || comment?.user?.email}
                            />
                          ) : (
                            <Comment key={ind} comment={comment} />
                          );
                        })}

                      <div
                        ref={bottomRef}
                        // style={{ float: "left", clear: "both" }}
                      />
                    </Fragment>
                  ))
              )}
            </div>

            <SpaceAreaInput space={spaceData} />
          </>
        )}
      </div>
    </>
  );
};

export default SpaceArea;
