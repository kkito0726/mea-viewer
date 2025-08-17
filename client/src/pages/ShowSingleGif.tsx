import { FigImageTemplate } from "../components/template/FigImageTemplate";
import { PageName } from "../enum/PageName";

export const ShowSingleGif = () => {
  return (
    <FigImageTemplate
      displayName="1電極表示-GIF動画作成"
      pageName={PageName.SHOW_SINGLE_GIF}
    />
  );
};
