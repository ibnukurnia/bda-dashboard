import React, { useState } from 'react';
import { Maximize, Minimize } from 'react-feather';
import Button from '../system/Button/Button';
import useUpdateEffect from '@/hooks/use-update-effect';

interface FullscreenComponentProps {
  elementRef: React.RefObject<HTMLDivElement>;
  onToggle?: (isFullscreen: boolean) => void;
}

const FullscreenComponent: React.FC<FullscreenComponentProps> = ({ elementRef, onToggle }) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(document.fullscreenElement != null)

  useUpdateEffect(() => {
    onToggle && onToggle(isFullscreen)
  }, [isFullscreen])
  
  const toggleFullscreen = () => {
    if (elementRef.current) {
      if (!document.fullscreenElement) {
        elementRef.current.requestFullscreen()
          .then(() => {
            setIsFullscreen(true)
          })
          .catch((err) => {
            console.error(`Error attempting to enable full-screen mode: ${err.message}`);
          });
      } else {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false);
        });
      }
    }
  };

  return (
    <Button onClick={toggleFullscreen}>
      {!isFullscreen ?
        <Maximize className='w-6 h-5'/> :
        <Minimize className='w-6 h-5'/>
      }
    </Button>
  );
};

export default FullscreenComponent;
