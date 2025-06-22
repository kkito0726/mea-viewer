import { ChangeEvent } from "react";
import { getPeakFormData } from "../../../hooks/getPeakFormData";
import { PeakFormValue } from "../../../types/PeakFormValue";
import { PageName } from "../../../enum/PageName";
import { MEAViewerInputForm } from "../../molecule/MEAViewerInputForm";
import { Checkbox } from "../../molecule/Checkbox";
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
        <Checkbox
          name="isPositive"
          checked={peakFormValue.isPositive}
          onChange={handlePeakFormChange}
          label="Positive Peaks"
        />
        <Checkbox
          name="isNegative"
          checked={peakFormValue.isNegative}
          onChange={handlePeakFormChange}
          label="Negative Peaks"
        />
      </div>

      <div>
        <div className="grid grid-cols-2 gap-4">
          {peakFormData.map((data, i) => {
            return (
              <div key={i}>
                <MEAViewerInputForm
                  label={data.label}
                  name={data.name}
                  value={data.value}
                  min={1}
                  max={undefined}
                  step={1}
                  onChange={handlePeakFormChange}
                />
              </div>
            );
          })}
          {[PageName.DRAW_2D, PageName.DRAWLine].includes(
            pageName as PageName
          ) ? (
            <>
              <Checkbox
                name="isLoop"
                checked={peakFormValue.isLoop}
                onChange={handlePeakFormChange}
                label="環状経路"
              />
              <MEAViewerInputForm
                label={"拍動周期の基準電極"}
                name={"baseCh"}
                value={peakFormValue.baseCh}
                min={1}
                max={64}
                step={1}
                onChange={handlePeakFormChange}
              />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
