import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  gifSectionData,
  graphSectionData,
} from "../../../hooks/getSidebarData";

type SidebarProps = {
  name: string;
};

export const Sidebar: React.FC<SidebarProps> = ({ name }) => {
  const [graphOpen, setGraphOpen] = useState<boolean>(() => {
    const stored = localStorage.getItem("graphOpen");
    return stored ? JSON.parse(stored) : true;
  });
  const [gifOpen, setGifOpen] = useState<boolean>(() => {
    const stored = localStorage.getItem("gifOpen");
    return stored ? JSON.parse(stored) : false;
  });
  useEffect(() => {
    localStorage.setItem("graphOpen", JSON.stringify(graphOpen));
    localStorage.setItem("gifOpen", JSON.stringify(gifOpen));
  }, [graphOpen, gifOpen]);

  return (
    <nav className="w-sidebar min-w-sidebar bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] h-screen-minus-topbar overflow-y-auto hide-scrollbar">
      {/* Graph Section */}
      <div className="pt-4">
        <button
          className="flex items-center w-full px-4 py-2 text-xs font-semibold tracking-wider uppercase text-slate-500 hover:text-slate-300 transition-colors duration-150 font-ui"
          onClick={() => setGraphOpen(!graphOpen)}
        >
          <svg
            className={`w-3 h-3 mr-2 transition-transform duration-200 ${graphOpen ? "rotate-90" : ""}`}
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M6 4l4 4-4 4z" />
          </svg>
          <span>Graph</span>
        </button>
        {graphOpen && (
          <ul className="py-1">
            {graphSectionData.map((data, i) => (
              <Link key={i} to={data.link}>
                <li
                  className={`flex items-center pl-9 pr-3 py-2 text-sm font-ui cursor-pointer transition-all duration-150 ${
                    name === data.name
                      ? "text-green-400 bg-[var(--accent-glow)] border-r-2 border-green-400"
                      : "text-slate-400 hover:text-slate-200 hover:bg-[var(--bg-hover)]"
                  }`}
                >
                  {data.label}
                </li>
              </Link>
            ))}
          </ul>
        )}
      </div>

      {/* GIF Section */}
      <div className="mt-2">
        <button
          className="flex items-center w-full px-4 py-2 text-xs font-semibold tracking-wider uppercase text-slate-500 hover:text-slate-300 transition-colors duration-150 font-ui"
          onClick={() => setGifOpen(!gifOpen)}
        >
          <svg
            className={`w-3 h-3 mr-2 transition-transform duration-200 ${gifOpen ? "rotate-90" : ""}`}
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M6 4l4 4-4 4z" />
          </svg>
          <span>GIF Animation</span>
        </button>
        {gifOpen && (
          <ul className="py-1">
            {gifSectionData.map((data, i) => (
              <Link key={i} to={data.link}>
                <li
                  className={`flex items-center pl-9 pr-3 py-2 text-sm font-ui cursor-pointer transition-all duration-150 ${
                    name === data.name
                      ? "text-green-400 bg-[var(--accent-glow)] border-r-2 border-green-400"
                      : "text-slate-400 hover:text-slate-200 hover:bg-[var(--bg-hover)]"
                  }`}
                >
                  {data.label}
                </li>
              </Link>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
};
