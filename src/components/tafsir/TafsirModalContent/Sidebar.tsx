interface ISidebarProps {
  surahNo: number;
  ayahNo: number;
  activeAuthor: string;
  onAuthorChange: (author: string) => void;
}

export const Sidebar = ({
  surahNo,
  ayahNo,
  activeAuthor,
  onAuthorChange,
}: ISidebarProps) => {
  const authors = ["Ibn Kathir", "Maarif Ul Quran", "Tazkirul Quran"];

  return (
    <div className="w-full md:w-72 bg-surface-container/80 p-6 flex flex-col border-r border-outline-variant/15 shrink-0 h-full overflow-y-auto">
      <div className="hidden md:block">
        <h3 className="text-label-sm tracking-widest text-primary font-bold uppercase mb-2">
          Deep Study
        </h3>
        <div className="mb-8 text-body-sm text-on-surface-variant">
          Verse {surahNo}:{ayahNo}
        </div>
      </div>

      <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-hide">
        {authors.map((author) => {
          const formattedAuthor = author.toLowerCase().replace(/\s+/g, "-");
          const isActive = activeAuthor === formattedAuthor;
          return (
            <button
              key={formattedAuthor}
              onClick={() => onAuthorChange(formattedAuthor)}
              className={`text-left px-5 py-4 text-label-sm font-bold tracking-[0.05em] uppercase rounded-xl transition-all whitespace-nowrap md:whitespace-normal border ${
                isActive
                  ? "bg-primary/10 text-primary border-primary/20 shadow-sm"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface border-transparent"
              }`}
            >
              {author}
            </button>
          );
        })}
      </div>
    </div>
  );
};
