import { MEAViewerLogo } from "../atom/MEAViewerLogo";
import { MEAViewerSubLogo } from "../atom/MEAViewerSubLogo";

export const BodyMainLogo = () => {
  return (
    <div className="flex flex-col justify-center items-center absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 select-none">
      <div className="opacity-20">
        <MEAViewerLogo size={8} />
      </div>
      <div className="mt-2 opacity-15">
        <MEAViewerSubLogo size={null} />
      </div>
    </div>
  );
};
