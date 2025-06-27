import { ChangeEvent, useRef } from "react";
import { HedValue } from "../../../../types/HedValue";
import { MEAViewerSelectForm } from "../../../molecule/MEAViewerSelectForm";

type BioInputProps = {
  handleRefreshHedFile: () => void;
  hedValue: HedValue;
  handleHedChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  handleHedFile: (e: ChangeEvent<HTMLInputElement>) => void;
  hedName: string;
};

export const HedInput: React.FC<BioInputProps> = ({
  handleRefreshHedFile,
  hedValue,
  handleHedChange,
  handleHedFile,
  hedName,
}) => {
  const rateValues = [100000, 50000, 25000, 20000, 10000, 5000];
  const gainValues = [20, 100, 1000, 2000, 5000, 10000, 20000, 50000];

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      <div className="px-4 text-gray-300 max-w-2xl mx-auto">
        <div className="flex flex-col px-4 pt-2 pb-1">
          <span className="block font-medium text-gray-300 rounded-sm text-sm px-1">
            .hedファイルから値を設定する
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
            type="file"
            accept=".hed"
            className="hidden"
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleHedFile(e)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MEAViewerSelectForm
            label="サンプリングレート (Hz)"
            name="sampling_rate"
            value={hedValue.sampling_rate}
            onChange={handleHedChange}
            disabled={!!hedName}
            optionValues={rateValues}
          />
          <MEAViewerSelectForm
            label="Gain"
            name="gain"
            value={hedValue.gain}
            onChange={handleHedChange}
            disabled={!!hedName}
            optionValues={gainValues}
          />
        </div>
        {hedName ? (
          <div className="flex items-center justify-between">
            <span>{hedName}</span>
            <button
              className="mt-2 bg-gray-400 hover:bg-gray-700 text-white font-bold p-2 rounded text-sm"
              onClick={handleRefreshHedFile}
            >
              Refresh
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
