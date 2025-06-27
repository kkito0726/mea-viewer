import { ChangeEvent, useRef } from "react";
import { ReadTime } from "../../../../types/ReadTime";
import { MEAViewerInputForm } from "../../../molecule/MEAViewerInputForm";

type BioInputProps = {
  handleReadBio: () => void;
  readTime: ReadTime;
  handleReadTime: (e: ChangeEvent<HTMLInputElement>) => void;
  handleBioInput: (e: ChangeEvent<HTMLInputElement>) => void;
  bioName: string;
};

export const BioInput: React.FC<BioInputProps> = ({
  handleReadBio,
  readTime,
  handleReadTime,
  handleBioInput,
  bioName,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  return (
    <div className="px-4 py-2 text-white">
      <div className="flex flex-col px-4 pb-1">
        <span className="block font-medium text-gray-300 rounded-sm text-sm px-1">
          .bioファイルを選択
        </span>
        <button
          type="button"
          className="mt-1 block w-full px-4 py-2 text-center text-white bg-green-600 border border-green-600 rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-opacity-50"
          onClick={handleFileButtonClick}
        >
          ファイルを選択
        </button>
        <input
          ref={fileInputRef}
          onChange={handleBioInput}
          type="file"
          accept=".bio"
          className="hidden"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MEAViewerInputForm
          label={"開始時間 (s)"}
          name={"start"}
          value={readTime.start}
          min={0}
          max={readTime.end - 1}
          step={1}
          onChange={handleReadTime}
        />
        <MEAViewerInputForm
          label={"終了時間 (s)"}
          name={"end"}
          value={readTime.end}
          min={readTime.start + 1}
          max={undefined}
          step={1}
          onChange={handleReadTime}
        />
      </div>
      {bioName ? (
        <>
          <div className="flex flex-col p-2">
            <div className="flex justify-between">
              <div>
                <span>{bioName}</span>
              </div>
              <div>
                <span>
                  {readTime.start} ~ {readTime.end} (s)
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className=" bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleReadBio}
            >
              Read Again
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
};
