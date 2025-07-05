import { Link } from "react-router-dom";
import { MEAViewerLogo } from "../../atom/MEAViewerLogo";

type TopbarProps = {
  displayName: string;
};

export const Topbar: React.FC<TopbarProps> = ({ displayName }) => {
  return (
    <div className="flex items-center justify-between w-screen bg-zinc-950 border-zinc-600 sticky top-0 z-50 p-2 min-h-8">
      <Link to={"/"}>
        <div className="p-2 rounded cursor-pointer hover:bg-zinc-900">
          <MEAViewerLogo size={null} />
        </div>
      </Link>
      <span className="text-green-400 ml-32">{displayName}</span>

      <div className="text-slate-200">
        <Link to={"/login"}>
          <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Logout
          </button>
        </Link>
      </div>
    </div>
  );
};
