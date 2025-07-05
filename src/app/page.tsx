"use client";

import { useEffect, useState } from 'react';

const Home = () => {
  const [isDesktop, setIsDesktop] = useState<boolean>(true);

  useEffect(() => {
    // Kiểm tra tỷ lệ màn hình khi trang được tải
    const checkScreenRatio = () => {
      // Nếu chiều rộng của màn hình nhỏ hơn chiều cao, thì có thể là điện thoại
      if (window.innerWidth < window.innerHeight) {
        setIsDesktop(false); // Điện thoại
      } else {
        setIsDesktop(true); // Máy tính
      }
    };

    // Lắng nghe sự thay đổi kích thước màn hình
    window.addEventListener('resize', checkScreenRatio);

    // Kiểm tra tỷ lệ màn hình ban đầu khi component được mount
    checkScreenRatio();

    // Dọn dẹp khi component bị unmount
    return () => {
      window.removeEventListener('resize', checkScreenRatio);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      {/* Video Background */}
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
      {/* Nội dung của trang */}
      <h1 style={{ position: 'relative', color: 'white', textAlign: 'center', zIndex: 1 }}>
        Hello, Next.js!
      </h1>
    </div>
  );
};

export default Home;
