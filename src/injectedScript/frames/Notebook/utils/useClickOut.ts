import { useEffect, RefObject } from "react";

function useClickOut(
  refs: RefObject<HTMLElement>[],
  callback: () => void
): void {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      const isClickOutside = refs.every(ref => {
        return ref.current && !ref.current.contains(event.target as Node);
      });

      if (isClickOutside) {
        callback();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refs, callback]);
}

export { useClickOut };
export default useClickOut;
