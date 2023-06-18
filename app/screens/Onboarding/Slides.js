import { useEffect, useState } from "react";
import Illustrations from "./Illustrations";
import { SpinnerCircular } from "spinners-react";

const Slides = ({ handleAuth }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(current => (current === 2 ? 0 : current + 1));
    }, 4000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="slides-screen">
      <div className="slides-container">
        <div className="slides" data-slide={current}>
          <div className="slide">
            <h2>
              Power and control over <br /> your web browsing
            </h2>
            <p>
              Create, categorize and set reminders for <br /> your bookmarks
            </p>
            <div className="illustration">
              <Illustrations.screenOne />
            </div>
          </div>
          <div className="slide">
            <h2>
              Connect and share <br /> with friends
            </h2>
            <p>
              Invite friends, connect contacts and share <br /> web psges with
              anyone, anywhere.
            </p>
            <div className="illustration">
              <Illustrations.screenTwo />
            </div>
          </div>
          <div className="slide">
            <h2>
              Personalise your <br /> webpages
            </h2>
            <p>
              Add annotations and comments to any <br /> web page.
            </p>
            <div className="illustration">
              <Illustrations.screenThree />
            </div>
          </div>
        </div>
      </div>

      <div className="bottom-nav">
        <div className="bullets">
          {[0, 1, 2].map((i, ind) => (
            <div
              key={ind}
              className={`bullet ${i === current && "active"}`}
              onClick={e => setCurrent(i)}
            />
          ))}
        </div>
      </div>

      <div className="signin-btn-cover">
        <button className="signin-btn" onClick={handleAuth}>
          <p>Sign in with Google</p>
        </button>
      </div>
    </div>
  );
};

export default Slides;
