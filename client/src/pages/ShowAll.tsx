import { Body } from "../components/body/Body";
import { Sidebar } from "../components/sidebar/Sidebar";
import { Topbar } from "../components/topbar/Topbar";
import { fetchShowAll } from "../hooks/fetchApi";

export const ShowAll = () => {
  return (
    <div className="w-screen hidden-scrollbar">
      <Topbar displayName="64電極表示" />
      <div className="flex w-full min-h-screen">
        <Sidebar name="showAll" />
        <Body pageName="showAll" fetchApi={fetchShowAll} />
      </div>
    </div>
  );
};
