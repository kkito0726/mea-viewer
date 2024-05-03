import { ShowAllBody } from "../components/ShowAllBody";
import { Sidebar } from "../components/Sidebar";
import { Topbar } from "../components/Topbar";

export const ShowAll = () => {
  return (
    <div className="w-screen hidden-scrollbar">
      <Topbar />
      <div className="flex w-full min-h-screen ">
        <Sidebar />
        <ShowAllBody />
      </div>
    </div>
  );
};
