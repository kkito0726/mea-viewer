import { FormValues } from "../../../types/FormValues";
import { getFormData } from "../../../hooks/getFormData";
import { Footer } from "../../footer/Footer";
import { PeakForm, PeakFormProps } from "./PeakForm";
import { MEAViewerInputForm } from "../../molecule/MEAViewerInputForm";

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
    <div className="px-4 text-white">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
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
        <div className="flex justify-end">
          <button
            type="button"
            className="mt-4 bg-gray-400 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-3"
            onClick={handleInitialize}
          >
            Initialize
          </button>
          <button
            type="submit"
            className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </div>
      </form>
      <Footer />
    </div>
  );
};
