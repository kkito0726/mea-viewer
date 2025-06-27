import { Topbar } from "../components/organism/topbar/Topbar";
import { Sidebar } from "../components/organism/sidebar/Sidebar";
import { Body } from "../components/organism/body/Body";
import { PageName } from "../enum/PageName";

export const ShowDetection = () => {
  return (
    <div className="min-h-screen w-screen">
      <div className="overflow-auto">
        <Topbar displayName="積み上げ表示" />
        <div className="flex">
          <Sidebar name={PageName.SHOW_DETECTION} />
          <Body pageName={PageName.SHOW_DETECTION} />
        </div>
      </div>
    </div>
  );
};
