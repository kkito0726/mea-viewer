import { Link } from "react-router-dom";
import { MEAViewerLogo } from "../../atom/MEAViewerLogo";

type TopbarProps = {
  displayName: string;
};

export const Topbar: React.FC<TopbarProps> = ({ displayName }) => {
  return (
    <div className="flex items-center justify-between w-screen bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] sticky top-0 z-50 px-4 h-12">
      <Link to={"/"}>
        <div className="px-2 py-1 rounded-md cursor-pointer hover:bg-[var(--bg-hover)] transition-colors duration-150">
          <MEAViewerLogo size={null} />
        </div>
      </Link>

      {displayName && (
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="font-mono text-sm text-green-400 tracking-wide">
            {displayName}
          </span>
        </div>
      )}

      <div className="font-ui text-xs text-slate-500 tracking-wider uppercase">
        LaRC FB Hosei Univ.
      </div>
    </div>
  );
};
