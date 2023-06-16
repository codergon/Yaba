const Emptystate = ({
  isTasks = false,
  imageIndex = Math.floor(Math.random() * 2),
}) => {
  const emptystates = [
    {
      title: `Connect with your ideas! ${
        isTasks ? "Create a task" : "Start by creating a new note."
      }`,
      image: chrome.runtime.getURL("images/Torso.svg"),
    },
    {
      title: `Light up your creativity! ${
        isTasks ? "Create a task" : "Start by creating a new note."
      }`,
      image: chrome.runtime.getURL("images/Lamp.svg"),
    },
  ];

  return (
    <div className="yaba-notebook__notes--emptystate">
      <img src={emptystates[imageIndex].image} alt="Notes" />
      <p>{emptystates[imageIndex].title}</p>
    </div>
  );
};

export default Emptystate;
