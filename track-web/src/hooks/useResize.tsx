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

    // Hack: Wait 1ms allows chartist to render
    setTimeout(() => {
      setWidth(ref.current.offsetWidth);
      setHeight(ref.current.offsetHeight);
    }, 1);

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [ref, ref.current])

  return { height, width }
}