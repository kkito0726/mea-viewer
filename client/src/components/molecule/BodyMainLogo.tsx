import { MEAViewerLogo } from "../atom/MEAViewerLogo";
import { MEAViewerSubLogo } from "../atom/MEAViewerSubLogo";

export const BodyMainLogo = () => {
  return (
    <div className="flex flex-col justify-center items-center text-slate-300 px-11 absolute top-1/2 transform -translate-y-1/2">
      <MEAViewerLogo size={8} />
      <div className="flex justify-end items-end w-full">
        <MEAViewerSubLogo size={2} />
      </div>
    </div>
  );
};
