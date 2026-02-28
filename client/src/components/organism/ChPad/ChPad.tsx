type ChPadProps = {
  gridSize: number;
  activeChs: number[];
  toggleButton: (index: number) => void;
  handleClearChs: () => void;
  handleSelectAllChs: () => void;
};

export const ChPad: React.FC<ChPadProps> = ({
  gridSize,
  activeChs,
  toggleButton,
  handleClearChs,
  handleSelectAllChs,
}) => {
  return (
    <div className="p-4 panel-section">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-4 rounded-full bg-green-500/60" />
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-ui">
          Channel Selector
        </span>
      </div>

      <div className="flex items-center justify-center">
        <div className="grid grid-cols-8 gap-0.5">
          {Array.from({ length: gridSize * gridSize }, (_, index) => (
            <button
              key={index}
              className={`w-9 h-9 text-xs font-mono font-medium rounded-sm transition-all duration-100 ${
                activeChs.includes(index + 1)
                  ? "bg-green-500/80 text-white shadow-[0_0_6px_rgba(34,197,94,0.3)]"
                  : "bg-[var(--bg-elevated)] text-slate-500 hover:bg-[var(--bg-hover)] hover:text-slate-300"
              }`}
              onClick={() => toggleButton(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-3">
        <button
          className="text-xs font-ui font-medium text-slate-400 hover:text-slate-200 bg-[var(--bg-hover)] px-3 py-1.5 rounded-md transition-colors duration-150"
          onClick={handleClearChs}
        >
          All OFF
        </button>
        <button
          className="text-xs font-ui font-medium text-green-400 bg-[var(--accent-dim)] hover:bg-[var(--accent-muted)] border border-green-500/20 hover:border-green-500/30 px-3 py-1.5 rounded-md transition-all duration-150"
          onClick={handleSelectAllChs}
        >
          All ON
        </button>
      </div>
    </div>
  );
};
