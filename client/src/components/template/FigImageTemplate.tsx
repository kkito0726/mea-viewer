import { PageName } from "../../enum/PageName";
import { Body } from "../organism/body/Body";
import { Sidebar } from "../organism/sidebar/Sidebar";
import { Topbar } from "../organism/topbar/Topbar";

type Props = {
  displayName: string;
  pageName: PageName;
};

export const FigImageTemplate: React.FC<Props> = ({
  displayName,
  pageName,
}) => {
  return (
    <div className="min-h-screen w-screen">
      <div className="overflow-auto">
        <Topbar displayName={displayName} />
        <div className="flex">
          <Sidebar name={pageName} />
          <Body pageName={pageName} />
        </div>
      </div>
    </div>
  );
};
