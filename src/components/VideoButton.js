"use client";

import { Play, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function VideoButton() {
  const [isOpen, setIsOpen] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Play Button Thumbnail */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative block w-full aspect-video group"
      >
        <img
          src="https://img.youtube.com/vi/mqqft2x_Aa4/maxresdefault.jpg"
          alt="Trim Pulses Explainer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play className="w-8 h-8 text-black fill-black ml-1" />
          </div>
        </div>
      </button>

      {/* Modal Popup */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setIsOpen(false)}
        >
          {/* Modal Container */}
          <div
            className="relative w-full max-w-4xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-cyan-400 transition-colors z-50"
            >
              <X className="w-8 h-8" />
            </button>

            {/* YouTube Embed */}
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/mqqft2x_Aa4?autoplay=1"
              title="Trim Pulses Explainer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
}
