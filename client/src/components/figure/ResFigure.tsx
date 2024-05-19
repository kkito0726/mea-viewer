import { Processing } from "../Processing";

type FigureProps = {
  isPost: boolean;
  imgSrc: string;
};
export const ResFigure: React.FC<FigureProps> = ({ isPost, imgSrc }) => {
  return (
    <div className="flex flex-col w-3/5">
      {isPost ? <Processing message="処理中です..." /> : null}
      {imgSrc ? (
        <div className="flex justify-center py-4 px-8 absolute top-1/2 transform -translate-y-1/2">
          <img
            src={"data:image/png;base64," + imgSrc}
            className="rounded-2xl max-w-screen-sm"
            alt=""
          />
        </div>
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
