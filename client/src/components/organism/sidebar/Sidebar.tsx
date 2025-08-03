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
  const buttonCss = "ml-5 p-3 cursor-pointer hover:bg-zinc-800 ";
  const selectCss = "bg-zinc-900";

  return (
    <div>
      {/* グラフ描画セクション */}
      <div className="mt-4">
        <div
          className="flex items-center px-3 py-2 font-bold text-slate-400 cursor-pointer select-none"
          onClick={() => setGraphOpen(!graphOpen)}
        >
          <span className="mr-2">{graphOpen ? "▼" : "▶"}</span>
          <span>グラフ描画</span>
        </div>
        {graphOpen && (
          <ul className="p-0 m-0 list-none text-slate-300">
            {graphSectionData.map((data, i) => (
              <Link key={i} to={data.link}>
                <li
                  className={
                    name === data.name ? buttonCss + selectCss : buttonCss
                  }
                >
                  <p>{data.label}</p>
                </li>
              </Link>
            ))}
          </ul>
        )}
      </div>
      {/* GIF動画作成セクション */}
      <div className="mt-4">
        <div
          className="flex items-center px-3 py-2 font-bold text-slate-400 cursor-pointer select-none"
          onClick={() => setGifOpen(!gifOpen)}
        >
          <span className="mr-2">{gifOpen ? "▼" : "▶"}</span>
          <span>GIF 動画作成</span>
        </div>
        {gifOpen && (
          <ul className="p-0 m-0 list-none text-slate-300">
            {gifSectionData.map((data, i) => (
              <Link key={i} to={data.link}>
                <li
                  className={
                    name === data.name ? buttonCss + selectCss : buttonCss
                  }
                >
                  <p>{data.label}</p>
                </li>
              </Link>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
