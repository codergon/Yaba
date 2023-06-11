import Vectors from "../../../../common/Vectors";

const SpaceMembers = ({ members }) => {
  return (
    <div className="space-members">
      {members.length > 0 && (
        <ul className="space-members-list">
          {members.map((contact, index) => {
            return (
              <li key={index} onClick={e => handleSelect(contact)}>
                <div className="user-details">
                  <Vectors.user />
                  <div className="user-info">
                    <p className="email">{contact}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SpaceMembers;
