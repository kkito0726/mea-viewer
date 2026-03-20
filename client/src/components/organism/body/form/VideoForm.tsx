import React, { ChangeEvent } from "react";
import { getVideoFormData } from "../../../../hooks/getFormData";
import { VideoFormValue } from "../../../../types/FormValues";
import { MEAViewerInputForm } from "../../../molecule/MEAViewerInputForm";

type Props = {
  value: VideoFormValue;
  handleFormChange: (e: ChangeEvent<HTMLInputElement>) => void;
};
export const VideoForm: React.FC<Props> = ({ value, handleFormChange }) => {
  const videoFormData = getVideoFormData(value);
  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-4 rounded-full bg-green-500/40" />
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-ui">
          GIF Settings
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {videoFormData.map((data, i) => {
          return (
            <div key={i}>
              <MEAViewerInputForm
                label={data.label}
                name={data.name}
                value={data.value}
                min={data.min}
                max={undefined}
                step={data.step}
                onChange={handleFormChange}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
