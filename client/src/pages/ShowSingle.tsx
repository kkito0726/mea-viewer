import { ShowSingleBady } from "../components/ShowSingleBody";
import { Sidebar } from "../components/Sidebar";
import { Topbar } from "../components/Topbar";

export const ShowSingle = () => {
  return (
    <div className="w-screen hidden-scrollbar">
      <Topbar />
      <div className="flex w-full min-h-screen">
        <Sidebar name="showSingle" />
        <ShowSingleBady />
      </div>
    </div>
  );
};
