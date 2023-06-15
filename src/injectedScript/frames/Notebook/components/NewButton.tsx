import { Plus } from "lucide-react";

interface NewButtonProps {
  createNew: any;
}

const NewButton = ({ createNew }: NewButtonProps) => {
  return (
    <button
      className="yaba-notebook__new-button"
      onClick={() => createNew && createNew()}
    >
      <Plus size={16} />
    </button>
  );
};

export default NewButton;
