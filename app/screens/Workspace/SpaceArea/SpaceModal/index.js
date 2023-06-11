import "./spacemodal.scss";
import { useRef, useState } from "react";
import Icons from "../../../../common/Icons";
import AddParticipants from "./AddParticipants";
import SpaceMembers from "./SpaceMembers";
import { useClickOut } from "../../../../hooks/useClickOut";

const SpaceModal = ({ screen, space, setScreen }) => {
  const modalRef = useRef(null);
  useClickOut(modalRef, () => setScreen(null));

  const handleScreen = () => {
    if (screen === "add-member") {
      setScreen("participants");
    }
    if (screen === "participants") {
      setScreen("add-member");
    }
  };

  const closeModal = () => setScreen(null);

  return (
    <div className={`yaba-app-modal sm-space`}>
      <div className={`yaba-app-modal-content sm-space`} ref={modalRef}>
        <div className="yaba-app-modal-content-header no-border">
          <button data-active={false} onClick={handleScreen} />
          <p>{screen === "add-member" ? "Add Participants" : "Particpants"}</p>
          <button className="sm-icon" onClick={e => setScreen(null)}>
            <Icons.close />
          </button>
        </div>

        {screen === "add-member" ? (
          <AddParticipants
            spaceId={space?.id}
            members={space?.members}
            closeModal={closeModal}
          />
        ) : (
          <SpaceMembers members={space?.members} />
        )}
      </div>
    </div>
  );
};

export default SpaceModal;
