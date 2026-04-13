"use client";

import { useState } from "react";

interface ShareButtonProps {
  type: string;
  nickname: string;
  framework: string;
  confidence?: number;
  strengths?: string[];
}

export default function ShareButton({
  type,
  nickname,
  framework,
  confidence = 0,
  strengths = [],
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const ogUrl = `/api/og?type=${encodeURIComponent(type)}&nickname=${encodeURIComponent(nickname)}&framework=${encodeURIComponent(framework)}&confidence=${confidence}&strengths=${encodeURIComponent(strengths.join(","))}`;

  const shareText = `I'm a ${type} (${nickname}) — find out your type at`;
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${type} — ${nickname}`,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="space-y-4">
      {/* Preview card */}
      <div className="rounded-xl border border-surface-700 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ogUrl}
          alt={`${type} personality card`}
          className="w-full"
          loading="lazy"
        />
      </div>

      {/* Share actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleNativeShare}
          className="flex items-center gap-2 bg-accent-blue hover:brightness-110 text-white font-medium px-5 py-2.5 rounded-xl transition-all text-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"/>
            <circle cx="6" cy="12" r="3"/>
            <circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
          Share your type
        </button>

        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-surface-800 hover:bg-surface-700 text-surface-200 font-medium px-5 py-2.5 rounded-xl transition-colors text-sm border border-surface-700"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Post on X
        </a>

        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 bg-surface-800 hover:bg-surface-700 text-surface-200 font-medium px-5 py-2.5 rounded-xl transition-colors text-sm border border-surface-700"
        >
          {copied ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
              Copy link
            </>
          )}
        </button>
      </div>
    </div>
  );
}
