import { ShowSingleBady } from "../components/body/ShowSingleBody";
import { Sidebar } from "../components/sidebar/Sidebar";
import { Topbar } from "../components/topbar/Topbar";

export const ShowSingle = () => {
  return (
    <div className="w-screen hidden-scrollbar">
      <Topbar displayName="1電極表示" />
      <div className="flex w-full min-h-screen">
        <Sidebar name="showSingle" />
        <ShowSingleBady />
      </div>
    </div>
  );
};
