import { Body } from "../components/body/Body";
import { Sidebar } from "../components/sidebar/Sidebar";
import { Topbar } from "../components/topbar/Topbar";
import { fetchShowSingle } from "../hooks/fetchApi";

export const ShowSingle = () => {
  return (
    <div className="w-screen hidden-scrollbar">
      <Topbar displayName="1電極表示" />
      <div className="flex w-full min-h-screen">
        <Sidebar name="showSingle" />
        <Body pageName="showSingle" fetchApi={fetchShowSingle} />
      </div>
    </div>
  );
};
