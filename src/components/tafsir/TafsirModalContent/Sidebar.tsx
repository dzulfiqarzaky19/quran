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
    <div className="w-full md:w-72 bg-surface-container/80 p-3 md:p-6 flex flex-col border-b md:border-b-0 md:border-r border-outline-variant/15 shrink-0 h-auto md:h-full overflow-y-auto">
      <div className="hidden md:block mb-4">
        <h3 className=" px-4 md:px-5 text-label-md tracking-widest text-primary font-bold uppercase ">
          Deep Study
        </h3>
      </div>

      <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide">
        {authors.map((author) => {
          const formattedAuthor = author.toLowerCase().replace(/\s+/g, "-");
          const isActive = activeAuthor === formattedAuthor;
          return (
            <button
              key={formattedAuthor}
              onClick={() => onAuthorChange(formattedAuthor)}
              className={`text-left px-4 py-2.5 md:px-5 md:py-4 text-[10px] md:text-label-sm font-bold tracking-[0.05em] uppercase rounded-lg md:rounded-xl transition-all whitespace-nowrap md:whitespace-normal border ${
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
