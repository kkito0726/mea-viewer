import { Body } from "../components/body/Body";
import { Sidebar } from "../components/sidebar/Sidebar";
import { Topbar } from "../components/topbar/Topbar";
import { fetchShowAll } from "../hooks/fetchApi";

export const ShowAll = () => {
  return (
    <div className="min-h-screen w-screen">
      <div className="overflow-auto">
        <Topbar displayName="64電極表示" />
        <div className="flex">
          <Sidebar name="showAll" />
          <Body pageName="showAll" fetchApi={fetchShowAll} />
        </div>
      </div>
    </div>
  );
};
