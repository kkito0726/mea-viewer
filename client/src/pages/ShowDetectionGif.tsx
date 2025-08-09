import { PageName } from "../enum/PageName";
import { FigImageTemplate } from "../components/template/FigImageTemplate";

export const ShowDetectionGif = () => {
  return (
    <FigImageTemplate
      displayName="積み上げ表示-GIF動画作成"
      pageName={PageName.SHOW_DETECTION_GIF}
    />
  );
};
