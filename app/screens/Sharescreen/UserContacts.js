import _ from "lodash";
import { useState } from "react";
import Icons from "../../common/Icons";
import Vectors from "../../common/Vectors";

const UserContacts = ({ sendTo, setSendTo, setScreen, contactList }) => {
  const [search, setSearch] = useState("");

  const handleSelect = contact => {
    if (sendTo.includes(contact)) {
      setSendTo(p => p.filter(c => c !== contact));
    } else {
      setSendTo(p => [...p, contact]);
    }
  };

  return (
    <>
      <div className="search-bar-contact">
        <Icons.search />
        <input
          type="text"
          value={search}
          placeholder="Search"
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <ul className="userContacts">
        {contactList?.map((contact, index) => {
          if (
            [
              contact?.emailAddresses[0]?.value,
              contact?.names ? contact?.names[0]?.displayName : "",
            ].filter(txt => {
              return typeof txt === "string"
                ? txt.toLowerCase()?.includes(search.toLowerCase().trim())
                : false;
            }).length === 0
          )
            return;

          return (
            <li key={index} onClick={e => handleSelect(contact)}>
              <Icons.checkBox checked={sendTo.includes(contact)} />
              <div className="user-details">
                {contact?.photos ? (
                  contact?.photos[0]?.url ? (
                    <img src={contact?.photos[0]?.url} alt="" />
                  ) : (
                    <Vectors.user />
                  )
                ) : (
                  <Vectors.user />
                )}

                <div className="user-info">
                  {contact?.names ? (
                    <p className="name">{contact?.names[0]?.displayName}</p>
                  ) : null}

                  {contact?.emailAddresses ? (
                    <p className="email">{contact?.emailAddresses[0]?.value}</p>
                  ) : null}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <button className="select-contacts" onClick={e => setScreen("compose")}>
        SELECT ({sendTo?.length})
      </button>
    </>
  );
};

export default UserContacts;
