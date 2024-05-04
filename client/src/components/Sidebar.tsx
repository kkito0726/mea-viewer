import { Link } from "react-router-dom";
import { sidebarData } from "../hooks/getSidebarData";
import React from "react";

type SidebarProps = {
  name: string;
};
export const Sidebar: React.FC<SidebarProps> = ({ name }) => {
  const buttonCss = "p-5 cursor-pointer hover:bg-zinc-800 ";
  const selectCss = "bg-zinc-900";
  return (
    <div className="">
      <div className="cursor-pointer">
        <ul className="p-0 m-0 list-none text-slate-300 text-center">
          {sidebarData.map((data, i) => {
            return (
              <Link to={data.link}>
                <li
                  key={i}
                  className={
                    name === data.name ? buttonCss + selectCss : buttonCss
                  }
                >
                  <p>{data.label}</p>
                </li>
              </Link>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
