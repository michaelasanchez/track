import React, { useRef, useEffect, useState } from "react";

/**
 * Hook that alerts clicks outside of the passed ref
 */
export const useClickOutside = (ref: any) => {
    const [clickedOutside, setClickedOutside] = useState<boolean>(false);

    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        const handleClickOutside = (event: any) => {
            if (ref.current) {
                if (event.path.indexOf(ref.current) < 0) {
                  setClickedOutside(true);
                }
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);

    useEffect(() => {
      setClickedOutside(false);
    }, [clickedOutside])

    return clickedOutside;
}