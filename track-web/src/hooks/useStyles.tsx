import { useEffect, useState } from 'react';

const MAX_MOBILE_WIDTH = 767;

const getWidth = () =>
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;

const getMobile = () => getWidth() <= MAX_MOBILE_WIDTH;

export const useStyles = () => {
  const [mobile, setMobile] = useState<boolean>(getMobile());

  useEffect(() => {
    const resizeListener = () => {
      setMobile(getMobile());
    };

    window.addEventListener('resize', resizeListener);

    // clean up
    return () => window.removeEventListener('resize', resizeListener);
  }, []);

  return { mobile };
};
