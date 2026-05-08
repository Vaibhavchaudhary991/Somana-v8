"use client";
import { useEffect } from "react";

export default function VerticalAd() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <div>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-3750195818284635"
        data-ad-slot="2381066423"
        data-ad-format="vertical"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
