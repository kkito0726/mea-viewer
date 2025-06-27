import { Body } from "../components/organism/body/Body";
import { Sidebar } from "../components/organism/sidebar/Sidebar";
import { Topbar } from "../components/organism/topbar/Topbar";
import { PageName } from "../enum/PageName";

export const DrawLine = () => {
  return (
    <div className="min-h-screen w-screen">
      <div className="overflow-auto">
        <Topbar displayName="AMCカラーマップ" />
        <div className="flex">
          <Sidebar name={PageName.DRAWLine} />
          <Body pageName={PageName.DRAWLine} />
        </div>
      </div>
    </div>
  );
};
