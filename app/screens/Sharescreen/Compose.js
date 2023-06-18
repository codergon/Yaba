import { v4 } from "uuid";
import { db } from "../../fb";
import Icons from "../../common/Icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SpinnerCircular } from "spinners-react";
import { EmailValidator } from "../../utils/helpers";
import { useRecoilValue, useSetRecoilState } from "recoil";
import ReactTextareaAutosize from "react-textarea-autosize";
import { activeControlState, UserState } from "../../atoms/appState";
import { doc, serverTimestamp, writeBatch } from "firebase/firestore";

const Compose = ({
  data,
  sendTo,
  setNavTo,
  setSendTo,
  setScreen,
  contactList,
}) => {
  let navigate = useNavigate();
  const [error, setError] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [customMsg, setCustomMsg] = useState("");
  const [filteredList, setFilteredList] = useState([]);
  const [searchContacts, setSearchContacts] = useState("");
  const setActiveControl = useSetRecoilState(activeControlState);

  const user = useRecoilValue(UserState);

  useEffect(() => {
    const filtered = contactList.filter(contact =>
      contact?.emailAddresses[0]?.value
        ?.toLowerCase()
        ?.includes(searchContacts.toLowerCase().trim())
    );

    setFilteredList(filtered);
  }, [searchContacts]);

  const handleSelect = contact => {
    if (sendTo.includes(contact)) {
      setSendTo(p => p.filter(c => c !== contact));
    } else {
      setSendTo(p => [...p, contact]);
      setSearchContacts("");
      setIsValid(true);
    }
  };

  const shareToContact = async () => {
    try {
      if (!user?.uid || loading || sendTo?.length === 0) return;
      setLoading(true);
      setError(false);

      const id = v4();
      const commentId = v4();
      const shareData = {
        id,
        bookmark: {
          id: data?.id || "",
          link: data?.link || "",
          title: data?.title || "",
          image: data?.thumbnail || "",
          description: data?.description || "",
        },
        creatorId: user?.uid,
        dateCreated: serverTimestamp(),
        dateUpdated: serverTimestamp(),
        messageCount: !!customMsg ? 1 : 0,
        members: [
          user?.email,
          ...sendTo?.map(contact => contact.emailAddresses[0].value),
        ],
      };

      const batch = writeBatch(db);

      batch.set(doc(db, "workspaces", id), shareData);

      if (!!customMsg) {
        batch.set(doc(db, "comments", commentId), {
          user,
          id: commentId,
          workspaceId: id,
          message: customMsg,
          dateCreated: new Date().getTime(),
        });
      }

      await batch.commit();
      setActiveControl("workspace");
      navigate("/");
    } catch (err) {
      console.log(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="compose-mail">
        <div className="label">
          <p>Add members</p>
          <button
            onClick={e => {
              setNavTo("compose");
              setScreen("userContacts");
            }}
          >
            View contacts
          </button>
        </div>

        <div
          className="recipients-input-container"
          data-active={!!(sendTo?.length > 0)}
        >
          <div className="recipients-input scrollable">
            {sendTo.map((contact, index) => {
              return (
                <div key={index} className="selected-item">
                  <p>{contact?.emailAddresses[0]?.value}</p>
                  <button
                    className="close-btn"
                    onClick={e => handleSelect(contact)}
                  >
                    <div className="icon-cover">
                      <Icons.close size={6} />
                    </div>
                  </button>
                </div>
              );
            })}

            <input
              type="text"
              value={searchContacts}
              onKeyUp={e => {
                if (e.key === "Enter") {
                  const contact = {
                    emailAddresses: [{ value: searchContacts }],
                  };

                  if (EmailValidator.validate(searchContacts)) {
                    setSendTo(p => [...p, contact]);
                    setSearchContacts("");
                    setIsValid(true);
                  } else {
                    setIsValid(false);
                  }
                }
              }}
              onChange={e => setSearchContacts(e.target.value)}
              placeholder="Search contacts or add emails"
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

        {!isValid && <p className="error-msg sm">Not a valid email</p>}

        <div className="custom-text-cover">
          <ReactTextareaAutosize
            type="text"
            minRows={3}
            value={customMsg}
            className="custom-text"
            placeholder="Add a message"
            data-active={!!customMsg?.trim()}
            onChange={e => setCustomMsg(e.target.value)}
          />
        </div>

        <button className="send-mails" onClick={e => shareToContact()}>
          <p>Create workspace</p>
          {loading ? (
            <SpinnerCircular
              size={16}
              thickness={200}
              color="#5d5d5d"
              secondaryColor="#ddd"
            />
          ) : null}
        </button>

        {error && (
          <p className="error-msg">An error occurred while sending email(s)</p>
        )}
      </div>
    </>
  );
};

export default Compose;
