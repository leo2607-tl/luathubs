"use client";

import { useEffect, useState } from 'react';

const Home = () => {
  const [isDesktop, setIsDesktop] = useState<boolean>(true);

  useEffect(() => {
    const checkScreenRatio = () => {
      if (window.innerWidth / window.innerHeight >= 1.5) {
        setIsDesktop(true); 
      } else {
        setIsDesktop(false); 
      }
    };

    window.addEventListener('resize', checkScreenRatio);

    checkScreenRatio();

    return () => {
      window.removeEventListener('resize', checkScreenRatio);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      >
        <source
          src={isDesktop ? 'https://videos.pexels.com/video-files/5636977/5636977-uhd_2560_1440_24fps.mp4' : 'https://videos.pexels.com/video-files/8135024/8135024-uhd_1440_2732_25fps.mp4'}
          type="video/mp4"
        />
      </video>
      <h1 style={{ position: 'relative', color: 'white', textAlign: 'center', zIndex: 1 }}>
        Hello, Next.js!
      </h1>
    </div>
  );
};

export default Home;
