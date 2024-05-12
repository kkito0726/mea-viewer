import { Body } from "../components/body/Body";
import { Sidebar } from "../components/sidebar/Sidebar";
import { Topbar } from "../components/topbar/Topbar";
import { fetchShowSingle } from "../hooks/fetchApi";

export const ShowSingle = () => {
  return (
    <div className="min-h-screen w-screen">
      <div className="overflow-auto">
        <Topbar displayName="1電極表示" />
        <div className="flex">
          <Sidebar name="showSingle" />
          <Body pageName="showSingle" fetchApi={fetchShowSingle} />
        </div>
      </div>
    </div>
  );
};
