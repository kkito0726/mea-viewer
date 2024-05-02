import React from "react";
import { Link } from "react-router-dom";

export const Topbar: React.FC = () => {
  return (
    <div className="flex items-center justify-between w-screen sticky top-0 z-50 p-3 bg-gray-950">
      <Link to={"/"}>
        <div className="p-2 rounded cursor-pointer hover:bg-gray-700">
          <span className="text-slate-200">
            MEA <span className="text-green-400">Viewer</span>
          </span>
        </div>
      </Link>

      <div className="text-slate-200">LaRC FB Hosei Univ.</div>
    </div>
  );
};
