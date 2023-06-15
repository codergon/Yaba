const Emptystate = ({ isTasks = false }) => {
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
  const randomIndex = Math.floor(Math.random() * emptystates.length);

  return (
    <div className="yaba-notebook__notes--emptystate">
      <img src={emptystates[randomIndex].image} alt="Notes" />
      <p>{emptystates[randomIndex].title}</p>
    </div>
  );
};

export default Emptystate;
