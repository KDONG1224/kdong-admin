// base
import { useCallback, useEffect, useState } from 'react';

interface UseTargetScrollProps {
  x?: number;
  y?: number;
  target?: string;
}

export const useTargetScroll = ({
  x = 0,
  y = 0,
  target = '.ant-layout-content'
}: UseTargetScrollProps) => {
  const [scrollX, setScrollX] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  const listener = useCallback(() => {
    const _target = document.querySelector(target);

    const vw = Math.max(
      _target?.clientWidth || 0,
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    );
    const vh = Math.max(
      _target?.clientHeight || 0,
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0
    );

    setScrollX(vw - x);
    setScrollY(vh - y);
  }, [target, x, y]);

  useEffect(() => {
    const handleResize = () => {
      listener();
    };

    listener();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [listener, target]);

  return { scrollX, scrollY };
};
