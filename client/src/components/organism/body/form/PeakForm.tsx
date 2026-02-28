import { ChangeEvent } from "react";
import { getPeakFormData } from "../../../../hooks/getPeakFormData";
import { PeakFormValue } from "../../../../types/PeakFormValue";
import { PageName } from "../../../../enum/PageName";
import { MEAViewerInputForm } from "../../../molecule/MEAViewerInputForm";
import { Checkbox } from "../../../molecule/Checkbox";
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
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-4 rounded-full bg-green-500/40" />
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-ui">
          Peak Detection
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 pb-3">
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

      <div className="grid grid-cols-2 gap-3">
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
        {[
          PageName.DRAW_2D,
          PageName.DRAW_LINE,
          PageName.DRAW_2D_GIF,
          PageName.DRAW_LINE_GIF,
        ].includes(pageName as PageName) ? (
          <>
            <Checkbox
              name="isLoop"
              checked={peakFormValue.isLoop}
              onChange={handlePeakFormChange}
              label="環状経路"
            />
            <MEAViewerInputForm
              label={"Base Ch"}
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
  );
};
