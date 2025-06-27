import { Topbar } from "../components/organism/topbar/Topbar";
import { Sidebar } from "../components/organism/sidebar/Sidebar";
import { Body } from "../components/organism/body/Body";
import { PageName } from "../enum/PageName";

export const RasterPlot = () => {
  return (
    <div className="min-h-screen w-screen">
      <div className="overflow-auto">
        <Topbar displayName={PageName.RASTER_PLOT} />
        <div className="flex">
          <Sidebar name={PageName.RASTER_PLOT} />
          <Body pageName={PageName.RASTER_PLOT} />
        </div>
      </div>
    </div>
  );
};
