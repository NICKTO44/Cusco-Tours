"use client";

import Script from "next/script";

export default function ElfsightPopup() {
  return (
    <>
      <Script
        src="https://elfsightcdn.com/platform.js"
        strategy="afterInteractive"
      />

      <div
        className="elfsight-app-34f2c149-eb5a-46b3-b286-9e34591887ca"
        data-elfsight-app-lazy
      />
    </>
  );
}