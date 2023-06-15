import Illustration from "./Illustration";
import { SpinnerCircular } from "spinners-react";

const EmptyState = ({
  title,
  description,
  isError,
  emptyList,
  isLoading,
  noMatch,
  noVector,
}) => {
  return (
    <div className="empty-state-container">
      {!noVector && (
        <>
          {emptyList ? (
            <Illustration.EmptyList size={140} />
          ) : noMatch ? (
            <Illustration.NoMatch size={140} />
          ) : isLoading ? (
            <Illustration.EmptySpace size={150} />
          ) : isError ? (
            <Illustration.Connectivity size={130} />
          ) : (
            <SpinnerCircular size={30} color="#777" secondaryColor="#ccc" />
          )}
        </>
      )}

      {title && <p className="title">{title}</p>}
      {description && <p>{description}</p>}
    </div>
  );
};

export default EmptyState;
