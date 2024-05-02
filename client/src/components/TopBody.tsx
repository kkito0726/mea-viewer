import { Link } from "react-router-dom";

export const TopBody = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-slate-200 text-8xl mr-10">
        LaR<span className="text-green-400">Code</span>
      </div>
      <div className="text-slate-200 text-2xl text-center">
        <span className="text-5xl">
          MEA<span className="text-green-400"> Viewer</span>
        </span>
        <p className="mt-6">計測データを即座に確認！</p>
        <Link to={"/showAll"}>
          <p className="mt-7 text-4xl bg-green-600 rounded-full p-3 cursor-pointer hover:bg-green-400">
            Let's Start
          </p>
        </Link>
      </div>
    </div>
  );
};
