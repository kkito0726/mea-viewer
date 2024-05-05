import React, { ChangeEvent, useRef } from "react";
import { barCss } from "../hooks/barCss";
import { ReadTime } from "../hooks/readBio";

type BioInputProps = {
  readTime: ReadTime;
  handleReadTime: (e: ChangeEvent<HTMLInputElement>) => void;
  handleBioInput: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const BioInput: React.FC<BioInputProps> = ({
  readTime,
  handleReadTime,
  handleBioInput,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  return (
    <div className="p-4 bg-zinc-700 text-white max-w-2xl mx-auto my-10 rounded-lg shadow-lg">
      <div className="flex flex-col p-4 mb-4">
        <span className="block font-medium text-gray-300 rounded-sm">
          .bioファイルを選択
        </span>
        <button
          type="button"
          className="mt-1 block w-full px-4 py-2 text-center text-white bg-green-500 border border-green-600 rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-opacity-50"
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
        <div>
          <label htmlFor="">開始時間 (s)</label>
          <input
            className={barCss}
            name="start"
            type="number"
            value={readTime.start}
            onChange={handleReadTime}
          />
        </div>
        <div>
          <label htmlFor="">終了時間 (s)</label>
          <input
            className={barCss}
            name="end"
            type="number"
            value={readTime.end}
            onChange={handleReadTime}
          />
        </div>
      </div>
    </div>
  );
};
