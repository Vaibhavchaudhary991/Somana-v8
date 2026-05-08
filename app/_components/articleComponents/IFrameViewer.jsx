"use client";
import { FullscreenIcon, FileText, Loader2, AlertCircle } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

const IFrameViewer = ({ fileLinks }) => {
  const [fullscreenIframe, setFullscreenIframe] = useState(null);
  const [loadingStates, setLoadingStates] = useState({});
  const iframeRefs = useRef([]);

  const handleFullscreenToggle = (index) => {
    if (fullscreenIframe === index) {
      setFullscreenIframe(null);
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    } else {
      setFullscreenIframe(index);
      if (iframeRefs.current[index]) {
        iframeRefs.current[index].requestFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setFullscreenIframe(null);
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const handleLoad = (index) => {
    setLoadingStates((prev) => ({ ...prev, [index]: false }));
  };

  useEffect(() => {
    iframeRefs.current.forEach((el, index) => {
      if (el) {
        const iframe = el.querySelector("iframe");
        if (iframe) {
          const timer = setTimeout(() => handleLoad(index), 10000); // 10s fallback
          if (iframe.complete) {
            clearTimeout(timer);
            handleLoad(index);
          } else {
            iframe.addEventListener("load", () => {
              clearTimeout(timer);
              handleLoad(index);
            });
          }
        }
      }
    });
  }, [fileLinks]);

  if (!fileLinks) return null;

  // Split links by space, comma or newline and filter empty ones
  const links = fileLinks.split(/[\s,\n]+/).filter(link => link.trim() !== "");

  return (
    <div className="w-full mt-12 space-y-10">
      {links.map((link, index) => {
        const isFullscreen = fullscreenIframe === index;
        const isLoading = loadingStates[index] !== false;

        // Drive detection regex
        const driveRegex = /(?:https?:\/\/)?(?:drive\.google\.com\/(?:file\/d\/|open\?id=))([a-zA-Z0-9_-]+)/;
        const driveMatch = link.match(driveRegex);
        
        // Check if it's a Drive link and if it's valid
        const isDrive = link.includes("drive.google.com");
        const driveId = driveMatch ? driveMatch[1] : null;
        const isValidDrive = isDrive && driveId;

        // Content rendering logic
        let embedUrl = "";
        let error = null;

        if (isDrive) {
          if (driveId) {
            embedUrl = `https://drive.google.com/file/d/${driveId}/preview`;
          } else {
            error = "Invalid or non-public Google Drive link.";
          }
        } else if (link.startsWith("<iframe")) {
          // Fallback for legacy iframe strings
          const srcMatch = link.match(/src="([^"]+)"/);
          embedUrl = srcMatch ? srcMatch[1] : "";
        } else {
          // Treat as generic URL (could be Office, etc.)
          embedUrl = link;
        }

        return (
          <div
            key={index}
            className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500"
          >
            {/* Premium Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-zinc-50 dark:bg-zinc-800/40 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                    {isDrive ? "Google Drive PDF" : "Embedded Document"}
                  </h4>
                  <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                    Viewer — Doc {index + 1}
                  </p>
                </div>
              </div>
              
              {!error && (
                <button
                  onClick={() => handleFullscreenToggle(index)}
                  className="p-2.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl transition-colors text-zinc-600 dark:text-zinc-400 active:scale-95"
                  title="Enter Fullscreen"
                >
                  <FullscreenIcon className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Viewer Area */}
            <div 
              className="relative w-full overflow-hidden bg-zinc-50 dark:bg-zinc-950" 
              style={{ height: isFullscreen ? "100vh" : "750px" }}
            >
              {error ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-red-50 dark:bg-red-950/10">
                  <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                    <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                  </div>
                  <h5 className="text-base font-semibold text-red-800 dark:text-red-300 mb-2">
                    {error}
                  </h5>
                  <p className="max-w-md text-sm text-red-600 dark:text-red-400 leading-relaxed">
                    Please ensure the file is set to "Anyone with the link → Viewer" in your Drive sharing settings.
                  </p>
                </div>
              ) : (
                <>
                  {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm z-10 transition-opacity duration-500">
                      <div className="relative flex items-center justify-center">
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                        <div className="absolute inset-0 blur-xl bg-blue-500/20 rounded-full animate-pulse" />
                      </div>
                      <p className="mt-4 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">
                        Preparing Preview
                      </p>
                    </div>
                  )}
                  
                  <div
                    ref={(el) => (iframeRefs.current[index] = el)}
                    className="w-full h-full"
                  >
                    <iframe
                      src={embedUrl}
                      className="w-full h-full border-none"
                      loading="lazy"
                      allow="autoplay"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default IFrameViewer;
