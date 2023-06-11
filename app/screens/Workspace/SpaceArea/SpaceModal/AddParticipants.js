import {
  doc,
  arrayUnion,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import { v4 } from "uuid";
import { db } from "../../../../fb";
import { useRecoilValue } from "recoil";
import { useEffect, useState, createRef } from "react";
import Icons from "../../../../common/Icons";
import { useNavigate } from "react-router-dom";
import { SpinnerCircular } from "spinners-react";
import Vectors from "../../../../common/Vectors";
import { UserState } from "../../../../atoms/appState";
import { EmailValidator, storageGet } from "../../../../utils/helpers";

const AddParticipants = ({ spaceId, members, closeModal }) => {
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState("");
  const [loading, setLoading] = useState(false);
  const [filteredList, setFilteredList] = useState([]);
  const [searchContacts, setSearchContacts] = useState("");

  const [sendTo, setSendTo] = useState([]);
  const [contactList, setContactList] = useState([]);

  const user = useRecoilValue(UserState);

  // input ref
  const inputRef = createRef();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    const validateAcct = async () => {
      const { userContacts } = await storageGet(["userContacts"]);
      if (Array.isArray(userContacts)) setContactList(userContacts);
    };
    validateAcct();
  }, []);

  useEffect(() => {
    const filtered = contactList.filter(contact =>
      contact?.emailAddresses[0]?.value
        ?.toLowerCase()
        ?.includes(searchContacts.toLowerCase().trim())
    );

    setFilteredList(filtered);
  }, [searchContacts]);

  const handleSelect = contact => {
    if (members.includes(contact.emailAddresses[0].value)) {
      setIsValid("User already a member");
      return;
    } else {
      setIsValid("");
    }

    if (sendTo.includes(contact)) {
      setSendTo(p => p.filter(c => c !== contact));
    } else {
      setSendTo(p => [...p, contact]);
      setSearchContacts("");
      setIsValid("");
    }
  };

  const shareToContact = async (shareList = sendTo) => {
    console.log(shareList);

    if (!user?.uid || loading || shareList?.length === 0) return;
    setLoading(true);
    setError("");

    try {
      const commentId = v4();
      const batch = writeBatch(db);
      batch.update(doc(db, "workspaces", spaceId), {
        members: arrayUnion(
          ...shareList?.map(contact => contact.emailAddresses[0].value)
        ),
        dateUpdated: serverTimestamp(),
      });

      batch.set(doc(db, "comments", commentId), {
        user,
        id: commentId,
        userCount: shareList?.length,
        type: "member-added",
        workspaceId: spaceId,
        dateCreated: new Date().getTime(),
      });

      await batch.commit();
      closeModal();
    } catch (error) {
      console.log(error);
      setError("An error occurred while sending email(s)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="compose-mail no-space">
        {isValid && (
          <p
            className="error-msg sm"
            style={{
              textAlign: "center",
            }}
          >
            {isValid}
          </p>
        )}

        <div className="recipients-input" data-active={!!(sendTo?.length > 0)}>
          <div className="recipients-input-content">
            {sendTo.map((contact, index) => {
              return (
                <div key={index} className="selected-item">
                  <p>{contact?.emailAddresses[0]?.value}</p>
                  <button
                    className="close-btn"
                    onClick={e => handleSelect(contact)}
                  >
                    <div className="icon-cover">
                      <Icons.close />
                    </div>
                  </button>
                </div>
              );
            })}

            <input
              ref={inputRef}
              type="text"
              value={searchContacts}
              onKeyUp={e => {
                if (e.key === "Enter") {
                  const contact = {
                    emailAddresses: [{ value: searchContacts }],
                  };

                  if (members.includes(contact.emailAddresses[0].value)) {
                    setIsValid("User already a member");
                    return;
                  } else {
                    setIsValid("");
                  }

                  if (EmailValidator.validate(searchContacts)) {
                    setSendTo(p => [...p, contact]);
                    setSearchContacts("");
                    setIsValid("");
                  } else {
                    setIsValid("Invalid email address");
                  }
                }
              }}
              onChange={e => setSearchContacts(e.target.value)}
              placeholder="Search contact emails"
            />
          </div>

          {!!searchContacts && (
            <ul className="dropDown">
              {filteredList.slice(0, 3)?.map((contact, index) => {
                return (
                  <li key={index} onClick={e => handleSelect(contact)}>
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
                          <p className="name">
                            {contact?.names[0]?.displayName}
                          </p>
                        ) : null}

                        {contact?.emailAddresses ? (
                          <p className="email">
                            {contact?.emailAddresses[0]?.value}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <button
          className="send-mails"
          onClick={e => {
            if (searchContacts?.length > 0) {
              const contact = {
                emailAddresses: [{ value: searchContacts }],
              };

              if (members.includes(contact.emailAddresses[0].value)) {
                setIsValid("User already a member");
                return;
              } else {
                setIsValid("");
              }

              if (EmailValidator.validate(searchContacts)) {
                setSendTo(p => [...p, contact]);
                setSearchContacts("");
                setIsValid("");
                shareToContact([...sendTo, contact]);
              } else {
                setIsValid("Invalid email address");
                shareToContact();
              }
            }
          }}
        >
          <p>Connect Users</p>
          {loading ? (
            <SpinnerCircular
              size={16}
              thickness={200}
              color="#5d5d5d"
              secondaryColor="#ddd"
            />
          ) : null}
        </button>

        {error && <p className="error-msg">{error}</p>}
      </div>
    </>
  );
};

export default AddParticipants;
