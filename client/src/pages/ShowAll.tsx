import { ShowAllBody } from "../components/body/ShowAllBody";
import { Sidebar } from "../components/sidebar/Sidebar";
import { Topbar } from "../components/topbar/Topbar";

export const ShowAll = () => {
  return (
    <div className="w-screen hidden-scrollbar">
      <Topbar displayName="64電極表示" />
      <div className="flex w-full min-h-screen">
        <Sidebar name="showAll" />
        <ShowAllBody />
      </div>
    </div>
  );
};
