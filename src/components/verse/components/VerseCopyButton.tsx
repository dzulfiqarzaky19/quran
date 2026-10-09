"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface VerseCopyButtonProps {
  text: string;
}

export const VerseCopyButton = ({ text }: VerseCopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("Failed to copy verse:", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied" : "Copy verse"}
      className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors active:scale-[0.98] ${
        copied
          ? "text-primary"
          : "text-on-surface-variant hover:bg-surface-container-highest hover:text-primary"
      }`}
    >
      {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
    </button>
  );
};
