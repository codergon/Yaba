const MemberActionBar = ({ type, user }) => {
  return (
    <div className="space-area__comment-items__actions">
      <p>
        {type === "member-exit"
          ? (user || "Someone") + " left the space"
          : (user || "Someone") + " joined the space"}
      </p>
    </div>
  );
};

export default MemberActionBar;
