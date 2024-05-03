import React from "react";
import { FormValues } from "../types/FormValues";
import { getFormData } from "../hooks/getFormData";

type Props = {
  values: FormValues;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleInitialize: (e: { preventDefault: () => void }) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
};

export const Form: React.FC<Props> = ({
  values,
  handleChange,
  handleInitialize,
  handleSubmit,
}) => {
  const barCss =
    "mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500";
  const labelCss = "block text-sm font-medium text-gray-300 p-1";
  const formData = getFormData(values);
  return (
    <div className="p-4 bg-gray-500 text-white max-w-2xl mx-auto my-10 rounded-lg shadow-lg">
      <div className="p-4 rounded mb-2">
        <label
          htmlFor="start"
          className="block font-medium text-gray-300 rounded-sm"
        >
          hedファイルのフルパス追加
        </label>
        <input
          type="text"
          id="hed_path"
          name="hed_path"
          className={barCss}
          value={values.hed_path}
          onChange={handleChange}
        />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 bg-gray-500">
          {formData.map((data) => {
            return (
              <div>
                <label htmlFor={data.name} className={labelCss}>
                  {data.label}
                </label>
                <input
                  type="number"
                  id={data.name}
                  name={data.name}
                  className={barCss}
                  value={data.value}
                  onChange={handleChange}
                />
              </div>
            );
          })}
        </div>
        <div className="flex justify-end mt-4 bg-gray-500">
          <button
            type="submit"
            className="mt-4 bg-gray-400 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-3"
            onClick={handleInitialize}
          >
            Initialize
          </button>
          <button
            type="submit"
            className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};
