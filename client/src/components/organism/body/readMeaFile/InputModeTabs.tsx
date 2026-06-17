import { InputMode } from "../../../../hooks/useFileHandler";

type InputModeTabsProps = {
  inputMode: InputMode;
  handleInputMode: (mode: InputMode) => void;
};

const tabs: { mode: InputMode; label: string }[] = [
  { mode: "bio", label: ".hed / .bio" },
  { mode: "npz", label: ".npz" },
];

export const InputModeTabs: React.FC<InputModeTabsProps> = ({
  inputMode,
  handleInputMode,
}) => {
  return (
    <div className="flex gap-1 p-2 border-b border-[var(--border-subtle)]">
      {tabs.map(({ mode, label }) => {
        const isActive = inputMode === mode;
        return (
          <button
            key={mode}
            type="button"
            onClick={() => handleInputMode(mode)}
            className={`flex-1 px-3 py-1.5 text-xs font-ui font-medium rounded-md transition-all duration-150 ${
              isActive
                ? "bg-[var(--accent-glow)] text-green-400 ring-1 ring-green-500/30"
                : "text-slate-400 hover:bg-[var(--bg-hover)] hover:text-slate-200"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};
