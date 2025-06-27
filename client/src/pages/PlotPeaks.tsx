import { FigImageTemplate } from "../components/template/FigImageTemplate";
import { PageName } from "../enum/PageName";

export const PlotPeaks = () => {
  return (
    <FigImageTemplate displayName="ピーク抽出" pageName={PageName.PLOT_PEAKS} />
  );
};
