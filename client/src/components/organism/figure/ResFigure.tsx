import CancelIcon from "@mui/icons-material/Cancel";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SaveAlt } from "@mui/icons-material";
import { ImgResponse } from "../../../types/ImgResponse";
import { BodyMainLogo } from "../../molecule/BodyMainLogo";

type FigureProps = {
  imgs: ImgResponse[];
  handleRemoveImg: (index: number) => void;
};
export const ResFigure: React.FC<FigureProps> = ({ imgs, handleRemoveImg }) => {
  const handleCopyToClipboard = async (img_url: string) => {
    try {
      const blob = await fetch(img_url).then((r) => r.blob());
      const item = new ClipboardItem({ "image/png": blob });
      await navigator.clipboard.write([item]);
      toast.success("コピーしました", {
        position: "top-right",
        autoClose: 700,
        hideProgressBar: true,
      });
    } catch (error) {
      console.error("Failed to copy image: ", error);
    }
  };

  const handleDownloadImage = (img_url: string) => {
    const link = document.createElement("a");
    link.href = img_url;
    link.download = "image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <>
      <ToastContainer />

      <div className="flex flex-col">
        {imgs.length > 0 ? (
          imgs.map((img, i) => {
            return (
              <div
                key={i}
                className="flex items-center justify-center py-4 px-6 animate-fade-in"
              >
                <div className="relative group">
                  {img.ch ? (
                    <span className="absolute top-3 left-3 font-mono text-xs text-slate-400 bg-[var(--bg-surface)]/80 backdrop-blur-sm px-2 py-0.5 rounded">{`ch ${img.ch}`}</span>
                  ) : null}
                  <img
                    src={img.image_url}
                    className="rounded-lg max-w-screen-md border border-[var(--border-subtle)]"
                    alt=""
                  />

                  {/* Delete Button */}
                  <button
                    onClick={() => handleRemoveImg(i)}
                    className="absolute top-2 right-2 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-500/20"
                  >
                    <CancelIcon className="text-red-400" fontSize="small" />
                  </button>

                  {/* Copy / Download */}
                  <div className="absolute bottom-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <button
                      onClick={() => handleCopyToClipboard(img.image_url)}
                      className="p-1.5 text-slate-400 rounded-md bg-[var(--bg-surface)]/80 backdrop-blur-sm border border-[var(--border-subtle)] hover:text-green-400 hover:border-green-500/30 transition-colors duration-150"
                    >
                      <ContentCopyIcon fontSize="small" />
                    </button>
                    <button
                      onClick={() => handleDownloadImage(img.image_url)}
                      className="p-1.5 text-slate-400 rounded-md bg-[var(--bg-surface)]/80 backdrop-blur-sm border border-[var(--border-subtle)] hover:text-green-400 hover:border-green-500/30 transition-colors duration-150"
                    >
                      <SaveAlt fontSize="small" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <BodyMainLogo />
        )}
      </div>
    </>
  );
};
