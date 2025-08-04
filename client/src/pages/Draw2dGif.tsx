import { FigImageTemplate } from "../components/template/FigImageTemplate";
import { PageName } from "../enum/PageName";

export const Draw2DGif = () => {
  return (
    <FigImageTemplate
      displayName="2Dカラーマップ-GIF動画作成"
      pageName={PageName.DRAW_2D_GIF}
    />
  );
};
