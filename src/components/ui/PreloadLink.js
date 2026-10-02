"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

const HOVER_DELAY_MS = 120;

// URLs already requested in this browser session (shared by every PreloadLink)
const preloaded = new Set();

function prefersReducedData() {
  return (
    navigator.connection?.saveData ||
    window.matchMedia("(prefers-reduced-data: reduce)").matches
  );
}

function preloadImages(urls) {
  if (prefersReducedData()) return;

  for (const url of urls) {
    if (preloaded.has(url)) continue;
    preloaded.add(url);
    // Same request type as the destination <img>, so the browser cache is reused
    new Image().src = url;
  }
}

// A next/link that also warms the browser cache with the destination page's
// images once the user has hovered it for HOVER_DELAY_MS.
export default function PreloadLink({ preloadUrls = [], ...props }) {
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleMouseEnter = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => preloadImages(preloadUrls), HOVER_DELAY_MS);
  };

  const handleMouseLeave = () => clearTimeout(timer.current);

  return (
    <Link
      {...props}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
}
