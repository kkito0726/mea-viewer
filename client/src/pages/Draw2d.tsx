import { FigImageTemplate } from "../components/template/FigImageTemplate";
import { PageName } from "../enum/PageName";

export const Draw2D = () => {
  return (
    <FigImageTemplate
      displayName="2Dカラーマップ"
      pageName={PageName.DRAW_2D}
    />
  );
};
