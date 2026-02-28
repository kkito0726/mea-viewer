import { ChangeEvent, useRef } from "react";
import { ReadTime } from "../../../../types/ReadTime";
import { MEAViewerInputForm } from "../../../molecule/MEAViewerInputForm";

type BioInputProps = {
  handleReadBio: () => void;
  readTime: ReadTime;
  handleReadTime: (e: ChangeEvent<HTMLInputElement>) => void;
  handleBioInput: (e: ChangeEvent<HTMLInputElement>) => void;
  bioName: string;
};

export const BioInput: React.FC<BioInputProps> = ({
  handleReadBio,
  readTime,
  handleReadTime,
  handleBioInput,
  bioName,
}) => {
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
          .bio Data Input
        </span>
      </div>

      <button
        type="button"
        className="w-full px-4 py-2 text-sm font-ui font-medium text-green-400 bg-[var(--accent-dim)] border border-green-500/20 rounded-md hover:bg-[var(--accent-muted)] hover:border-green-500/30 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-green-500/30"
        onClick={handleFileButtonClick}
      >
        .bioファイルを選択
      </button>
      <input
        ref={fileInputRef}
        onChange={handleBioInput}
        type="file"
        accept=".bio"
        className="hidden"
      />

      <div className="grid grid-cols-2 gap-3 mt-3">
        <MEAViewerInputForm
          label={"Start (s)"}
          name={"start"}
          value={readTime.start}
          min={0}
          max={readTime.end - 1}
          step={1}
          onChange={handleReadTime}
        />
        <MEAViewerInputForm
          label={"End (s)"}
          name={"end"}
          value={readTime.end}
          min={readTime.start + 1}
          max={undefined}
          step={1}
          onChange={handleReadTime}
        />
      </div>

      {bioName ? (
        <div className="mt-3">
          <div className="flex items-center justify-between px-1">
            <span className="font-mono text-xs text-green-400/80 truncate">{bioName}</span>
            <span className="font-mono text-xs text-slate-500">
              {readTime.start}–{readTime.end}s
            </span>
          </div>
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              className="text-xs font-ui font-medium text-green-400 bg-[var(--accent-dim)] hover:bg-[var(--accent-muted)] border border-green-500/20 hover:border-green-500/30 px-3 py-1.5 rounded-md transition-all duration-150"
              onClick={handleReadBio}
            >
              Read Again
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
