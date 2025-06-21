import { ChangeEvent } from "react";
import { getPeakFormData } from "../../../hooks/getPeakFormData";
import { PeakFormValue } from "../../../types/PeakFormValue";
import { PageName } from "../../../enum/PageName";
import { MEAViewerInputForm } from "../../molecule/MEAViewerInputForm";
export type PeakFormProps = {
  pageName: string;
  peakFormValue: PeakFormValue;
  handlePeakFormChange: (e: ChangeEvent<HTMLInputElement>) => void;
};
export const PeakForm: React.FC<PeakFormProps> = ({
  pageName,
  peakFormValue,
  handlePeakFormChange,
}) => {
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
          <label className="ml-2">Positive Peaks</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isNegative"
            checked={peakFormValue.isNegative}
            onChange={handlePeakFormChange}
            className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
          />
          <label className="ml-2">Negative Peaks</label>
        </div>
      </div>

      <div>
        <div className="grid grid-cols-2 gap-4">
          {peakFormData.map((data, i) => {
            return (
              <div key={i}>
                <MEAViewerInputForm
                  inputLabelProps={{ name: data.name, label: data.label }}
                  numberFormProps={{
                    name: data.name,
                    value: data.value,
                    min: 1,
                    max: undefined,
                    step: 1,
                    handleChange: handlePeakFormChange,
                  }}
                />
              </div>
            );
          })}
          {[PageName.DRAW_2D, PageName.DRAWLine].includes(
            pageName as PageName
          ) ? (
            <>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isLoop"
                  max={64}
                  checked={peakFormValue.isLoop}
                  onChange={handlePeakFormChange}
                  className="form-checkbox h-5 w-5 text-indigo-600"
                  id="isLoop"
                />
                <label htmlFor="isLoop" className="ml-2">
                  環状経路
                </label>
              </div>
              <div className="flex flex-col">
                <MEAViewerInputForm
                  inputLabelProps={{
                    name: "baseCh",
                    label: "拍動周期の基準電極",
                  }}
                  numberFormProps={{
                    name: "baseCh",
                    value: peakFormValue.baseCh,
                    min: 1,
                    max: 64,
                    step: 1,
                    handleChange: handlePeakFormChange,
                  }}
                />
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
