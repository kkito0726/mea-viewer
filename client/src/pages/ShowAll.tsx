import { Body } from "../components/organism/body/Body";
import { Sidebar } from "../components/organism/sidebar/Sidebar";
import { Topbar } from "../components/organism/topbar/Topbar";
import { PageName } from "../enum/PageName";

export const ShowAll = () => {
  return (
    <div className="min-h-screen w-screen">
      <div className="overflow-auto">
        <Topbar displayName="64電極表示" />
        <div className="flex">
          <Sidebar name={PageName.SHOW_ALL} />
          <Body pageName={PageName.SHOW_ALL} />
        </div>
      </div>
    </div>
  );
};
