import { FigImageTemplate } from "../components/template/FigImageTemplate";
import { PageName } from "../enum/PageName";

export const Draw3D = () => {
  return (
    <FigImageTemplate
      displayName="3Dカラーマップ"
      pageName={PageName.DRAW_3D}
    />
  );
};
