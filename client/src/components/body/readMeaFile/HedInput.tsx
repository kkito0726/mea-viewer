import { ChangeEvent, useRef } from "react";
import { HedValue } from "../../../types/HedValue";

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
  const barCss =
    "mt-1 block w-full px-3 py-2 text-green-300 bg-zinc-800 border-none rounded-md shadow-sm focus: border-none";

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="mx-2">
      <div className="p-4 bg-zinc-700 text-gray-300 max-w-2xl mx-auto my-10 rounded-lg">
        <div className="flex flex-col p-4 mb-4">
          <span className="block font-medium text-gray-300 rounded-sm">
            .hedファイルから値を設定する
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
            type="file"
            accept=".hed"
            className="hidden"
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleHedFile(e)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="sampling-rate">サンプリングレート (Hz)</label>
            <select
              className={barCss}
              value={hedValue.sampling_rate}
              onChange={handleHedChange}
              name="sampling_rate"
              id="sampling-rate"
              disabled={!!hedName}
            >
              {rateValues.map((value, i) => (
                <option key={i} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="gain">Gain</label>
            <select
              className={barCss}
              value={hedValue.gain}
              onChange={handleHedChange}
              name="gain"
              id="gain"
              disabled={!!hedName}
            >
              {gainValues.map((value, i) => (
                <option key={i} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>
        {hedName ? (
          <div className="flex items-center justify-between">
            <span>{hedName}</span>
            <button
              className="mt-4 bg-gray-400 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-3"
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
