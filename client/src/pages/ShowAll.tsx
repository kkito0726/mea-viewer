import { FigImageTemplate } from "../components/template/FigImageTemplate";
import { PageName } from "../enum/PageName";

export const ShowAll = () => {
  return (
    <FigImageTemplate displayName="64電極表示" pageName={PageName.SHOW_ALL} />
  );
};
