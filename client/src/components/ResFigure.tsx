import { FigureProps } from "../types/FigureProps";

export const ResFigure: React.FC<FigureProps> = ({ isPost, imgSrc }) => {
  return (
    <>
      {isPost ? <p className="text-slate-200 rounded p-2">処理中です</p> : null}
      {imgSrc ? (
        <div className="p-3 bg-gray-500 rounded">
          <img
            src={"data:image/png;base64," + imgSrc}
            className="p-3 rounded"
            alt=""
          />
        </div>
      ) : null}
    </>
  );
};
