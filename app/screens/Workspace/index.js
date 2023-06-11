import "./workspace.scss";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import SpaceListItem from "./SpaceListItem";
import { useNavigate } from "react-router-dom";
import EmptyState from "../../common/EmptyState";
import {
  filteredSpaces,
  spaceItems,
  spacesError,
  spacesLoading,
  totalUnread,
  UserState,
} from "../../atoms/appState";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../fb";

const Workspace = () => {
  let navigate = useNavigate();

  const user = useRecoilValue(UserState);
  const spaceListInitial = useRecoilValue(spaceItems);

  const [error, setError] = useRecoilState(spacesError);
  const [loading, setLoading] = useRecoilState(spacesLoading);

  const [mocklist, setMocklist] = useState([]);
  const [spacesList, setSpaces] = useRecoilState(spaceItems);

  const spaceArr = useRecoilValue(filteredSpaces);

  useEffect(() => {
    if (!user?.uid) return;
    if (Boolean(mocklist.length > 0)) {
      setLoading(false);
      return;
    }
    // setLoading(true);

    const q = query(
      collection(db, "workspaces"),
      where("members", "array-contains", user?.email)
    );

    const unsub = onSnapshot(
      q,
      snapshot => {
        let wSpaces = [];
        snapshot.docs.forEach(doc => {
          wSpaces.push(doc.data());
        });

        setMocklist(wSpaces);
        setSpaces(wSpaces);
        setLoading(false);
      },
      err => {
        setError("An error occurred");
        setLoading(false);
      }
    );

    return () => typeof unsub === "function" && unsub();
  }, [user]);

  //  IMPLEMENTING UNREAD COUNT
  const [unreadSpaces, setUnreadSpaces] = useState({});
  // const setTotalUnread = useSetRecoilState(totalUnread);

  // useEffect(() => {
  //   const total = Object.values(unreadSpaces).reduce((a, b) => a + b, 0);
  //   setTotalUnread(total);
  // }, [unreadSpaces]);

  // useEffect(() => {
  //   if (spacesList.length) navigate("/space-area", { state: spacesList[0] });
  // }, [spacesList]);

  return (
    <div className="workspace__container">
      {loading ? (
        <EmptyState title={"Fetching Spaces..."} />
      ) : error || spaceArr?.length === 0 ? (
        <EmptyState
          isError
          isLoading={spaceListInitial?.length === 0}
          noMatch={spaceListInitial?.length > 0 && spaceArr?.length === 0}
          title={
            spaceArr?.length === 0
              ? spaceListInitial?.length === 0
                ? "You are not a member of any workspace Create a new workspace to get started"
                : "Your search did not match any workspaces"
              : "Error fetching spaces"
          }
          description={error}
        />
      ) : (
        spaceArr?.map(space => {
          return (
            <SpaceListItem
              key={space?.id}
              space={space}
              setUnreadSpaces={setUnreadSpaces}
            />
          );
        })
      )}
    </div>
  );
};

export default Workspace;
