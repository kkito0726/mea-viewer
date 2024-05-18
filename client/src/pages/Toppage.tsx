import { Topbar } from "../components/topbar/Topbar";
import { TopBody } from "../components/body/TopBody";

export const Toppage = () => {
  return (
    <div className="min-h-screen w-screen">
      <Topbar displayName="" />
      <TopBody />
    </div>
  );
};
