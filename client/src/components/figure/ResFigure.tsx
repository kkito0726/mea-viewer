import { Processing } from "../Processing";
import CancelIcon from "@mui/icons-material/Cancel";
import DownloadIcon from "@mui/icons-material/Download";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

type FigureProps = {
  isPost: boolean;
  imgSrc: string[];
  handleRemoveImg: (index: number) => void;
};
export const ResFigure: React.FC<FigureProps> = ({
  isPost,
  imgSrc,
  handleRemoveImg,
}) => {
  const handleCopyToClipboard = async (baseImg: string) => {
    try {
      const blob = await fetch("data:image/png;base64," + baseImg).then((r) =>
        r.blob()
      );
      const item = new ClipboardItem({ "image/png": blob });
      await navigator.clipboard.write([item]);
      alert("Image copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy image: ", error);
    }
  };

  const handleDownloadImage = (baseImg: string) => {
    const link = document.createElement("a");
    link.href = "data:image/png;base64," + baseImg;
    link.download = "image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="flex flex-col w-3/5">
      {isPost ? <Processing message="処理中です..." /> : null}
      {imgSrc.length > 0 ? (
        imgSrc.map((baseImg, i) => {
          return (
            <div key={i} className="relative flex justify-center py-4 px-8">
              <div className="relative group">
                <img
                  src={"data:image/png;base64," + baseImg}
                  className="rounded-2xl max-w-screen-sm"
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
                    onClick={() => handleCopyToClipboard(baseImg)}
                    className="text-gray-400 rounded-sm px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200 hover:text-gray-500"
                  >
                    <ContentCopyIcon />
                  </button>
                  <button
                    onClick={() => handleDownloadImage(baseImg)}
                    className="text-gray-400 rounded-sm px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200 hover:text-gray-500"
                  >
                    <DownloadIcon className="" />
                  </button>
                </div>
              </div>
            </div>
          );
        })
      ) : isPost ? null : (
        <div className="flex flex-col justify-center items-center text-gray-200 px-11 absolute top-1/2 transform -translate-y-1/2">
          <span className="text-8xl">
            MEA <span className="text-green-400">Viewer</span>
          </span>
          <div className="flex justify-end items-end w-full">
            <span className="text-2xl">
              Powered by LaR<span className="text-green-400">Code</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
