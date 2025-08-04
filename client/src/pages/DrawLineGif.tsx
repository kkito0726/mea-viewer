import { FigImageTemplate } from "../components/template/FigImageTemplate";
import { PageName } from "../enum/PageName";

export const DrawLineGif = () => {
  return (
    <FigImageTemplate
      displayName="AMCカラーマップ-GIF動画作成"
      pageName={PageName.DRAW_LINE_GIF}
    />
  );
};
