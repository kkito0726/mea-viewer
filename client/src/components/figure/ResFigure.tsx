type FigureProps = {
  isPost: boolean;
  imgSrc: string;
};
export const ResFigure: React.FC<FigureProps> = ({ isPost, imgSrc }) => {
  return (
    <div className="flex flex-col justify-center">
      {isPost ? (
        <div className="flex justify-center">
          <p className="text-slate-200 p-2">処理中です</p>
        </div>
      ) : null}
      {imgSrc ? (
        <div className="flex justify-center items-center py-4 px-8">
          <img
            src={"data:image/png;base64," + imgSrc}
            className="rounded-2xl"
            alt=""
          />
        </div>
      ) : isPost ? null : (
        <div className="flex flex-col justify-center items-center text-gray-200 px-11">
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
