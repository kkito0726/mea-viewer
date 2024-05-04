import React from "react";
import { Link } from "react-router-dom";

export const Topbar: React.FC = () => {
  return (
    <div className="flex items-center justify-between w-screen bg-zinc-950 border-zinc-600 sticky top-0 z-50 p-2">
      <Link to={"/"}>
        <div className="p-2 rounded cursor-pointer hover:bg-zinc-900">
          <span className="text-slate-200">
            MEA <span className="text-green-400">Viewer</span>
          </span>
        </div>
      </Link>

      <div className="text-slate-200">LaRC FB Hosei Univ.</div>
    </div>
  );
};
