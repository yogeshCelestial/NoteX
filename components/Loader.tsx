'use client';

export default function Loader() {
  return (
    <div className="flex items-center justify-center h-screen bg-[#fdfafa]">
      <svg
        className="w-28 h-28"
        viewBox="0 0 100 100"
        fill="none"
        stroke="black"
        strokeWidth="2"
      >
        {/* Left vertical triplet */}
        <path d="M20,80 L20,20" className="animate-line" />
        <path d="M25,80 L25,20" className="animate-line delay-100" />
        <path d="M30,80 L30,20" className="animate-line delay-200" />

        {/* Diagonal triplet (bottom-right to top-left for correct 'N') */}
        <path d="M80,80 L30,20" className="animate-line delay-300" />
        <path d="M75,80 L25,20" className="animate-line delay-400" />
        <path d="M70,80 L20,20" className="animate-line delay-500" />

        {/* Right vertical triplet */}
        <path d="M70,80 L70,20" className="animate-line delay-600" />
        <path d="M75,80 L75,20" className="animate-line delay-700" />
        <path d="M80,80 L80,20" className="animate-line delay-800" />
      </svg>

      <style jsx>{`
        .animate-line {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: draw 1.5s ease forwards infinite;
        }

        @keyframes draw {
          0% {
            stroke-dashoffset: 100;
          }
          60% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }
        .delay-400 {
          animation-delay: 0.4s;
        }
        .delay-500 {
          animation-delay: 0.5s;
        }
        .delay-600 {
          animation-delay: 0.6s;
        }
        .delay-700 {
          animation-delay: 0.7s;
        }
        .delay-800 {
          animation-delay: 0.8s;
        }
      `}</style>
    </div>
  );
}
