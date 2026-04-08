import React from "react";

interface TafsirContentProps {
  content: string;
  author: string;
}

export function TafsirContent({ content, author }: TafsirContentProps) {
  const renderText = (text: string) => {
    return text.split(/(\*\*.*?\*\*|\*.*?\*)/).map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="text-on-surface font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return (
          <em key={i} className="italic text-on-surface-variant">
            {part.slice(1, -1)}
          </em>
        );
      }
      return part;
    });
  };

  return (
    <div className="max-w-2xl mx-auto pb-16">
      <div className="text-label-sm tracking-widest text-primary font-bold uppercase mb-8">
        Commentary by {author}
      </div>

      <div className="text-body-lg leading-loose text-on-surface-variant space-y-6">
        {content
          .split("\n")
          .filter((p) => p.trim() !== "")
          .map((para, idx) => {
            const isNumbered = /^\d+[\.\)]/.test(para);
            return (
              <p
                key={idx}
                className={isNumbered ? "pt-4 font-medium text-on-surface" : ""}
              >
                {renderText(para)}
              </p>
            );
          })}
      </div>
    </div>
  );
}
