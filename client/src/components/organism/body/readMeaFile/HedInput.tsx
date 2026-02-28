import { ChangeEvent, useRef } from "react";
import { HedValue } from "../../../../types/HedValue";
import { MEAViewerSelectForm } from "../../../molecule/MEAViewerSelectForm";

type BioInputProps = {
  handleRefreshHedFile: () => void;
  hedValue: HedValue;
  handleHedChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  handleHedFile: (e: ChangeEvent<HTMLInputElement>) => void;
  hedName: string;
};

export const HedInput: React.FC<BioInputProps> = ({
  handleRefreshHedFile,
  hedValue,
  handleHedChange,
  handleHedFile,
  hedName,
}) => {
  const rateValues = [100000, 50000, 25000, 20000, 10000, 5000];
  const gainValues = [20, 100, 1000, 2000, 5000, 10000, 20000, 50000];

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="p-4 panel-section">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-4 rounded-full bg-green-500/60" />
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-ui">
          .hed Configuration
        </span>
      </div>

      <button
        type="button"
        className="w-full px-4 py-2 text-sm font-ui font-medium text-green-400 bg-[var(--accent-dim)] border border-green-500/20 rounded-md hover:bg-[var(--accent-muted)] hover:border-green-500/30 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-green-500/30"
        onClick={handleFileButtonClick}
      >
        .hedファイルを選択
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".hed"
        className="hidden"
        onChange={(e: ChangeEvent<HTMLInputElement>) => handleHedFile(e)}
      />

      <div className="grid grid-cols-2 gap-3 mt-3">
        <MEAViewerSelectForm
          label="Sample Rate (Hz)"
          name="sampling_rate"
          value={hedValue.sampling_rate}
          onChange={handleHedChange}
          disabled={!!hedName}
          optionValues={rateValues}
        />
        <MEAViewerSelectForm
          label="Gain"
          name="gain"
          value={hedValue.gain}
          onChange={handleHedChange}
          disabled={!!hedName}
          optionValues={gainValues}
        />
      </div>

      {hedName ? (
        <div className="flex items-center justify-between mt-3 px-1">
          <span className="font-mono text-xs text-green-400/80 truncate">{hedName}</span>
          <button
            className="text-xs font-ui font-medium text-slate-400 hover:text-slate-200 bg-[var(--bg-hover)] px-2.5 py-1 rounded transition-colors duration-150"
            onClick={handleRefreshHedFile}
          >
            Reset
          </button>
        </div>
      ) : null}
    </div>
  );
};
