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
                className="flex items-center justify-center py-4 px-8"
              >
                <div className="relative group">
                  {img.ch ? (
                    <span className="absolute top-5 left-2 text-zinc-800">{`ch ${img.ch}`}</span>
                  ) : null}
                  <img
                    src={img.image_url}
                    className="rounded max-w-screen-md"
                    alt=""
                  />

                  <button
                    onClick={() => handleRemoveImg(i)}
                    className="absolute top-2 right-2 text-white rounded-full px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <CancelIcon className="text-red-500" />
                  </button>
                  <div className="absolute bottom-2 right-2">
                    <button
                      onClick={() => handleCopyToClipboard(img.image_url)}
                      className="text-gray-400 rounded-sm px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200 hover:text-gray-500"
                    >
                      <ContentCopyIcon />
                    </button>
                    <button
                      onClick={() => handleDownloadImage(img.image_url)}
                      className="text-gray-400 rounded-sm px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200 hover:text-gray-500"
                    >
                      <SaveAlt />
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
