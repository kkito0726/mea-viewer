import { PageName } from "../enum/PageName";
import { FigImageTemplate } from "../components/template/FigImageTemplate";

export const RasterPlotGif = () => {
  return (
    <FigImageTemplate
      displayName="ラスタープロット-GIF動画作成"
      pageName={PageName.RASTER_PLOT_GIF}
    />
  );
};
