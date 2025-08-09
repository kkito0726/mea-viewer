import { FigImageTemplate } from "../components/template/FigImageTemplate";
import { PageName } from "../enum/PageName";

export const ShowAllGif = () => {
  return (
    <FigImageTemplate
      displayName="64電極表示-GIF動画作成"
      pageName={PageName.SHOW_ALL_GIF}
    />
  );
};
