import { FigImageTemplate } from "../components/template/FigImageTemplate";
import { PageName } from "../enum/PageName";

export const Draw3DGif = () => {
  return (
    <FigImageTemplate
      displayName="3Dカラーマップ-GIF動画作成"
      pageName={PageName.DRAW_3D_GIF}
    />
  );
};
