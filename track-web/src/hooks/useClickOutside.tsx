import React, { useRef, useEffect, useState } from "react";

/**
 * Hook that alerts clicks outside of the passed ref
 */
export const useClickOutside = (ref: any) => {
    const [clickedOutside, setClickedOutside] = useState<boolean>(false);

    useEffect(() => {
        /**
         * Update state if clicked on outside of element
         */
        const handleClickOutside = (event: any) => {
            if (ref.current) {
                let index = event.path.indexOf(ref.current);
                if (index < 0) {
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
      // Reset state after click outside occurs
      if (clickedOutside)
        setClickedOutside(false);
    }, [clickedOutside])

    return clickedOutside;
}