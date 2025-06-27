import { FigImageTemplate } from "../components/template/FigImageTemplate";
import { PageName } from "../enum/PageName";

export const DrawLine = () => {
  return (
    <FigImageTemplate
      displayName="AMCカラーマップ"
      pageName={PageName.DRAW_LINE}
    />
  );
};
