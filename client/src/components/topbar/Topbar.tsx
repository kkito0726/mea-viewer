import { Link } from "react-router-dom";

type TopbarProps = {
  displayName: string;
};

export const Topbar: React.FC<TopbarProps> = ({ displayName }) => {
  return (
    <div className="flex items-center justify-between w-screen bg-zinc-950 border-zinc-600 sticky top-0 z-50 p-2 min-h-8">
      <Link to={"/"}>
        <div className="p-2 rounded cursor-pointer hover:bg-zinc-900">
          <span className="text-slate-200">
            MEA <span className="text-green-400">Viewer</span>
          </span>
        </div>
      </Link>
      <span className="text-green-400 ml-32">{displayName}</span>

      <div className="text-slate-200">LaRC FB Hosei Univ.</div>
    </div>
  );
};
