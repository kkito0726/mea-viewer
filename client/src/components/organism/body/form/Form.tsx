import { FormValues } from "../../../../types/FormValues";
import { getFormData } from "../../../../hooks/getFormData";
import { Footer } from "../../footer/Footer";
import { PeakForm, PeakFormProps } from "./PeakForm";
import { MEAViewerInputForm } from "../../../molecule/MEAViewerInputForm";
import { VideoForm } from "./VideoForm";
import { gifPageList, PageName } from "../../../../enum/PageName";

export type FormProps = {
  pageName: string;
  values: FormValues;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleInitialize: (e: { preventDefault: () => void }) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
} & PeakFormProps;

export const Form: React.FC<FormProps> = ({
  pageName,
  values,
  handleChange,
  handleInitialize,
  handleSubmit,
  peakFormValue,
  handlePeakFormChange,
}) => {
  const formData = getFormData(values);
  return (
    <div className="p-4 font-ui">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-4 rounded-full bg-green-500/60" />
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Parameters
        </span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-3">
          {formData.map((data, i) => {
            return (
              <div key={i}>
                <MEAViewerInputForm
                  label={data.label}
                  name={data.name}
                  value={data.value}
                  min={data.min}
                  max={undefined}
                  step={data.step}
                  onChange={handleChange}
                />
              </div>
            );
          })}
        </div>
        <PeakForm
          pageName={pageName}
          peakFormValue={peakFormValue}
          handlePeakFormChange={handlePeakFormChange}
        />
        {gifPageList.includes(pageName as PageName) ? (
          <VideoForm
            value={values.videoFormValue}
            handleFormChange={handleChange}
          />
        ) : null}

        <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-[var(--border-subtle)]">
          <button
            type="button"
            className="text-sm font-ui font-medium text-slate-400 hover:text-slate-200 bg-[var(--bg-hover)] hover:bg-[var(--bg-elevated)] px-5 py-2 rounded-md transition-colors duration-150"
            onClick={handleInitialize}
          >
            Initialize
          </button>
          <button
            type="submit"
            className="text-sm font-ui font-semibold text-white bg-green-600 hover:bg-green-500 px-6 py-2 rounded-md transition-colors duration-150 shadow-[0_0_12px_rgba(34,197,94,0.2)] hover:shadow-[0_0_16px_rgba(34,197,94,0.3)]"
          >
            Submit
          </button>
        </div>
      </form>
      <Footer />
    </div>
  );
};
