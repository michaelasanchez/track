import { useEffect, useState } from 'react';

export const useResize = (ref: any) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        setWidth(ref.current.offsetWidth);
        setHeight(ref.current.offsetHeight);
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [ref, ref.current])

  return { width, height }
}