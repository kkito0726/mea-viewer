import { Body } from "../components/body/Body";
import { Sidebar } from "../components/sidebar/Sidebar";
import { Topbar } from "../components/topbar/Topbar";
import { PageName } from "../enum/PageName";

export const ShowSingle = () => {
  return (
    <div className="min-h-screen w-screen">
      <div className="overflow-auto">
        <Topbar displayName="1電極表示" />
        <div className="flex">
          <Sidebar name={PageName.SHOW_SINGLE} />
          <Body pageName={PageName.SHOW_SINGLE} />
        </div>
      </div>
    </div>
  );
};
