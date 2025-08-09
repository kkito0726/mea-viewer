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
    <div className="text-slate-200">
      <div className="py-2 block text-sm font-medium text-gray-300 px-1">
        <span>GIF動画作成条件</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
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
