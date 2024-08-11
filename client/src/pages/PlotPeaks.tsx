import { Body } from "../components/body/Body";
import { Sidebar } from "../components/sidebar/Sidebar";
import { Topbar } from "../components/topbar/Topbar";
import { PageName } from "../enum/PageName";

export const PlotPeaks = () => {
  return (
    <div className="min-h-screen w-screen">
      <div className="overflow-auto">
        <Topbar displayName="ピーク抽出" />
        <div className="flex">
          <Sidebar name={PageName.PlotPeaks} />
          <Body pageName={PageName.PlotPeaks} />
        </div>
      </div>
    </div>
  );
};
