import { Link } from "react-router-dom";

export const TopBody = () => {
  return (
    <div className="flex items-center justify-center min-h-screen-minus-topbar font-ui relative">
      {/* Subtle grid background */}
      <div className="absolute inset-0 grid-bg opacity-30" />

      <div className="relative z-10 flex items-center gap-12">
        <div className="text-slate-200/10 text-8xl font-bold tracking-tighter select-none">
          LaR<span className="text-green-400/20">Code</span>
        </div>
        <div className="text-center">
          <h1 className="text-5xl font-semibold tracking-tight text-slate-200">
            MEA<span className="text-green-400 ml-1">Viewer</span>
          </h1>
          <p className="mt-4 text-slate-500 text-sm tracking-wide">
            計測データを即座に確認
          </p>
          <Link to={"/showAll"}>
            <button className="mt-8 px-8 py-3 text-lg font-medium text-white bg-green-600 hover:bg-green-500 rounded-lg transition-all duration-200 shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:shadow-[0_0_30px_rgba(34,197,94,0.35)]">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
