import { ChangeEvent } from "react";
import { getPeakFormData } from "../../../hooks/getPeakFormData";
import { PeakFormValue } from "../../../types/PeakFormValue";
import { barCss } from "../../../hooks/barCss";
export type PeakFormProps = {
  peakFormValue: PeakFormValue;
  handlePeakFormChange: (e: ChangeEvent<HTMLInputElement>) => void;
};
export const PeakForm: React.FC<PeakFormProps> = ({
  peakFormValue,
  handlePeakFormChange,
}) => {
  const labelCss = "block text-sm font-medium text-gray-300 px-1";

  const peakFormData = getPeakFormData(peakFormValue);
  return (
    <div className="text-slate-200">
      <div className="py-2 block text-sm font-medium text-gray-300 px-1">
        <span>ピーク抽出条件</span>
      </div>

      <div className="grid grid-cols-2 gap-4 pb-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isPositive"
            checked={peakFormValue.isPositive}
            onChange={handlePeakFormChange}
            className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
          />
          <label htmlFor="posPeak" className="ml-2">
            Positive Peaks
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isNegative"
            checked={peakFormValue.isNegative}
            onChange={handlePeakFormChange}
            className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
          />
          <label htmlFor="negPeak" className="ml-2">
            Negative Peaks
          </label>
        </div>
      </div>

      <div>
        <div className="grid grid-cols-2 gap-4">
          {peakFormData.map((data, i) => {
            return (
              <div key={i}>
                <label htmlFor={data.name} className={labelCss}>
                  {data.label}
                </label>
                <input
                  type="number"
                  id={data.name}
                  name={data.name}
                  className={barCss}
                  value={data.value}
                  onChange={handlePeakFormChange}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
