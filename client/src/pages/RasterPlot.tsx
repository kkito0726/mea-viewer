import { PageName } from "../enum/PageName";
import { FigImageTemplate } from "../components/template/FigImageTemplate";

export const RasterPlot = () => {
  return (
    <FigImageTemplate
      displayName="ラスタープロット"
      pageName={PageName.RASTER_PLOT}
    />
  );
};
