import { ChangeEvent } from "react";
import { barCss } from "../../../hooks/barCss";
import { ChFormValue } from "../../../types/ChFormValue";

type ChFormProps = {
  values: ChFormValue;
  handleChange: (e: ChangeEvent<HTMLSelectElement>) => void;
};

export const ChForm: React.FC<ChFormProps> = ({ values, handleChange }) => {
  return (
    <div className="flex flex-col p-4 bg-zinc-700 text-white max-w-2xl mx-auto rounded-lg shadow-lg">
      <span className="block font-medium text-gray-300 rounded-sm">
        電極番号を選択
      </span>
      <select
        name="ch"
        id="ch-select"
        className={barCss}
        value={values.ch}
        onChange={handleChange}
      >
        {Array.from({ length: 64 }, (_, i) => (
          <option key={i} value={i + 1}>
            ch {i + 1}
          </option>
        ))}
      </select>
    </div>
  );
};
