import { Topbar } from "../components/organism/topbar/Topbar";
import { TopBody } from "../components/organism/body/TopBody";

export const Toppage = () => {
  return (
    <div className="min-h-screen w-screen">
      <Topbar displayName="" />
      <TopBody />
    </div>
  );
};
