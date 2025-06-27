import { Body } from "../components/organism/body/Body";
import { Sidebar } from "../components/organism/sidebar/Sidebar";
import { Topbar } from "../components/organism/topbar/Topbar";
import { PageName } from "../enum/PageName";

export const Draw3D = () => {
  return (
    <div className="min-h-screen w-screen">
      <div className="overflow-auto">
        <Topbar displayName="3Dカラーマップ" />
        <div className="flex">
          <Sidebar name={PageName.DRAW_3D} />
          <Body pageName={PageName.DRAW_3D} />
        </div>
      </div>
    </div>
  );
};
