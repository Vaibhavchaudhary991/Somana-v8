"use client";

import { useEffect } from "react";

const MultiplexAdUnit = () => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-format="autorelaxed"
        data-ad-client="ca-pub-3750195818284635"
        data-ad-slot="5326762147"
      ></ins>
    </div>
  );
};

export default MultiplexAdUnit;
