// components/WaveLoading.js
"use client";

import React from "react";
import Image from "next/image";
import image1 from "./images/loading/1.png";
import image2 from "./images/loading/2.png";
import image3 from "./images/loading/3.png";

export default function LoadingScene() {
  return (
    <div className="flex items-center justify-center gap-6 h-full text-center">
      <div className="wave w-24 h-24 relative">
        <Image src={image1} alt="img1" fill className="object-contain" />
      </div>
      <div className="wave delay-200 w-24 h-24 relative">
        <Image src={image2} alt="img2" fill className="object-contain" />
      </div>
      <div className="wave delay-400 w-20 h-20 relative">
        <Image src={image3} alt="img3" fill className="object-contain" />
      </div>

      <style jsx>{`
        .wave {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          animation: wave 1s infinite;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-400 {
          animation-delay: 0.4s;
        }
        @keyframes wave {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }
      `}</style>
    </div>
  );
}
