import { FigImageTemplate } from "../components/template/FigImageTemplate";
import { PageName } from "../enum/PageName";

export const ShowSingle = () => {
  return (
    <FigImageTemplate displayName="1電極表示" pageName={PageName.SHOW_SINGLE} />
  );
};
