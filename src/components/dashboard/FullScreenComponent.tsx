import React from 'react';
import { Maximize } from 'react-feather';
import Button from '../system/Button/Button';

interface FullscreenComponentProps {
  elementRef: React.RefObject<HTMLDivElement>
}

const FullscreenComponent: React.FC<FullscreenComponentProps> = ({ elementRef }) => {
  const handleFullscreen = () => {
    if (elementRef.current) {
      if (!document.fullscreenElement) {
        elementRef.current.requestFullscreen().catch((err) => {
          console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  return (
    <Button onClick={handleFullscreen}>
      <Maximize className='w-6 h-5'/>
    </Button>
  );
};

export default FullscreenComponent;
