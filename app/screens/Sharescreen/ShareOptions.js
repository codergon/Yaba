import { useState } from "react";
import Vectors from "../../common/Vectors";
import { FlowArrow } from "phosphor-react";
import SocialIcons from "../../common/SocialIcons";
import UserImage from "./components/UserImage";

const shareOptions = [
  // "SMS",
  "Copy",
  "Email",
  "Twitter",
  "Whatsapp",
  "LinkedIn",
  // "Telegram",
];

const ShareOptions = ({ data, setScreen, setSendTo, contactList }) => {
  const [showMore, setShowMore] = useState(false);

  const handleShare = social => {
    if (!data) return;

    const { title: text, link: url, hashtags = "YabaExtension" } = data;

    const title = "Hey, check out this link I saved on Yaba";

    switch (social) {
      case "Email": {
        // %0D%0A is newline
        const emailText = `${encodeURIComponent(text)}%0D%0A`;
        const mailto = `mailto:?subject=${title}&body=${emailText}${encodeURIComponent(
          url
        )}`;
        window.open(mailto);
        break;
      }
      case "Copy": {
        navigator.clipboard.writeText(`${title}\n${data.text || ""}\n${url}`);
        break;
      }
      case "SMS": {
        location.href = `sms:Pick a contact?&body=${encodeURIComponent(
          title
        )}: ${url}`;
        break;
      }
      case "Whatsapp": {
        window.open(
          "https://api.whatsapp.com/send?text=" +
            encodeURIComponent(text + "\n" + url)
        );
        break;
      }
      case "Twitter": {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            text
          )}&url=${encodeURIComponent(url)}&hashtags=${hashtags || ""}`
        );
        break;
      }
      case "LinkedIn": {
        window.open(
          `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
            url
          )}&title=${title}&summary=${text}&source=LinkedIn`
        );
        break;
      }
      case "Telegram": {
        window.open(
          "https://telegram.me/share/msg?url=" +
            encodeURIComponent(url) +
            "&text=" +
            encodeURIComponent(text)
        );
        break;
      }
      default:
        break;
    }
  };

  return (
    <>
      {contactList.length > 0 && (
        <>
          <div className="content-block contacts">
            <div className="label">
              <p>Contacts</p>
              <button onClick={e => setScreen("userContacts")}>View all</button>
            </div>
            <div className="contacts-list">
              {contactList.slice(0, 10).map(
                (contact, ind) =>
                  contact?.emailAddresses && (
                    <div
                      className="contact"
                      key={ind}
                      onClick={e => {
                        setSendTo([contact]);
                        setScreen("compose");
                      }}
                    >
                      <UserImage photos={contact?.photos} size={34} />

                      <p>
                        {contact?.names
                          ? contact?.names[0]?.displayName
                          : contact?.emailAddresses
                          ? contact?.emailAddresses[0]?.value
                          : null}
                      </p>
                    </div>
                  )
              )}
            </div>
          </div>
        </>
      )}

      <button className="c-button" onClick={() => setScreen("compose")}>
        <p>New Workspace</p>
        <FlowArrow size={13} weight="fill" />
      </button>

      <div className="content-block">
        <div className="label">
          {contactList.length > 0 ? "Or share via" : "Share via"}
        </div>

        <div className="share-option">
          {(showMore ? shareOptions : shareOptions.slice(0, 5)).map(
            (social, index) => {
              return (
                <div
                  key={index}
                  className="option"
                  onClick={e => handleShare(social)}
                >
                  {SocialIcons[social]()}
                  <p>{social === "Copy" ? social + " link" : social}</p>
                </div>
              );
            }
          )}
          {/* {!showMore && (
            <div className="option" onClick={e => setShowMore(true)}>
              <SocialIcons.Ellipsis />
              <p>More</p>
            </div>
          )} */}
        </div>
      </div>
    </>
  );
};

export default ShareOptions;
