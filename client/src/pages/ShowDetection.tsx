import { PageName } from "../enum/PageName";
import { FigImageTemplate } from "../components/template/FigImageTemplate";

export const ShowDetection = () => {
  return (
    <FigImageTemplate
      displayName="積み上げ表示"
      pageName={PageName.SHOW_DETECTION}
    />
  );
};
