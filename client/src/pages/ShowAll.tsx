import { ShowAllBody } from "../components/ShowAllBody";
import { Sidebar } from "../components/Sidebar";
import { Topbar } from "../components/Topbar";

export const ShowAll = () => {
  return (
    <div className="w-screen">
      <Topbar />
      <div className="flex w-screen min-h-screen">
        <Sidebar />
        <ShowAllBody />
      </div>
    </div>
  );
};
