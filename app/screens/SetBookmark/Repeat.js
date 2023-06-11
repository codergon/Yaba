import Icons from "../../common/Icons";

const Repeat = ({ setRepeat, repeat, setScreen }) => {
  return (
    <ul>
      {["never", "daily", "weekdays", "weekends", "weekly", "monthly"].map(
        (option, index) => (
          <li
            key={index}
            onClick={e => {
              setRepeat(option);
              setScreen("remInput");
            }}
          >
            <p>{option}</p>
            {repeat === option ? <Icons.done /> : null}
          </li>
        )
      )}
    </ul>
  );
};

export default Repeat;
