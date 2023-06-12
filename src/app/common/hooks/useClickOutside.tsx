import React, { MutableRefObject, useEffect } from 'react';

/**
 * Hook that runs callback on click outside of the passed ref
 */
type Props = {
  ref:  MutableRefObject<HTMLElement | null>,
  callback: () => void
}

export default function useClickOutside({ref, callback} : Props) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current!.contains(event.target as Node)) {
        callback()
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
}
