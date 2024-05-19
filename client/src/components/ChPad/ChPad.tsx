// import { useState } from "react";

type ChPadProps = {
  gridSize: number;
  activeChs: number[];
  toggleButton: (index: number) => void;
  handleClearChs: () => void;
  handleSelectAllChs: () => void;
};

export const ChPad: React.FC<ChPadProps> = ({
  gridSize,
  activeChs,
  toggleButton,
  handleClearChs,
  handleSelectAllChs,
}) => {
  return (
    <div className="px-3">
      <div className="flex items-center justify-center">
        <div className="grid grid-cols-8 gap-1">
          {Array.from({ length: gridSize * gridSize }, (_, index) => (
            <button
              key={index}
              className={`p-2 text-gray-200 ${
                activeChs.includes(index + 1) ? "bg-green-500" : "bg-zinc-500"
              }`}
              onClick={() => toggleButton(index)}
            >
              {/* ボタン番号表示 */}
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-end">
        <button
          className="mt-4 bg-gray-400 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-3"
          onClick={handleClearChs}
        >
          OFF
        </button>
        <button
          className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleSelectAllChs}
        >
          ON
        </button>
      </div>
    </div>
  );
};
