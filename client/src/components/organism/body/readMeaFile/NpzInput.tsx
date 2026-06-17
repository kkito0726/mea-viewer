import { ChangeEvent, useRef } from "react";

type NpzInputProps = {
  npzName: string;
  handleNpzInput: (e: ChangeEvent<HTMLInputElement>) => void;
  handleRefreshNpzFile: () => void;
};

export const NpzInput: React.FC<NpzInputProps> = ({
  npzName,
  handleNpzInput,
  handleRefreshNpzFile,
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
          .npz Data Input
        </span>
      </div>

      <button
        type="button"
        className="w-full px-4 py-2 text-sm font-ui font-medium text-green-400 bg-[var(--accent-dim)] border border-green-500/20 rounded-md hover:bg-[var(--accent-muted)] hover:border-green-500/30 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-green-500/30"
        onClick={handleFileButtonClick}
      >
        .npzファイルを選択
      </button>
      <input
        ref={fileInputRef}
        onChange={handleNpzInput}
        type="file"
        accept=".npz"
        className="hidden"
      />

      <p className="mt-3 text-xs text-slate-500 font-ui leading-relaxed">
        サンプリングレート・GAIN・電極間距離・読み込み範囲は npz
        ファイルから自動で復元されます。
      </p>

      {npzName ? (
        <div className="flex items-center justify-between mt-3 px-1">
          <span className="font-mono text-xs text-green-400/80 truncate">
            {npzName}
          </span>
          <button
            className="text-xs font-ui font-medium text-slate-400 hover:text-slate-200 bg-[var(--bg-hover)] px-2.5 py-1 rounded transition-colors duration-150"
            onClick={handleRefreshNpzFile}
          >
            Reset
          </button>
        </div>
      ) : null}
    </div>
  );
};
