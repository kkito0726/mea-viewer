import { ChangeEvent } from "react";
import { barCss } from "../../../hooks/barCss";
import { ChFormValue } from "../../../types/ChFormValue";

type ChFormProps = {
  values: ChFormValue;
  handleChange: (e: ChangeEvent<HTMLSelectElement>) => void;
};

export const ChForm: React.FC<ChFormProps> = ({ values, handleChange }) => {
  return (
    <div className="px-8 pb-1 text-white">
      <span className=" text-gray-300">電極番号を選択</span>
      <select
        name="ch"
        id="ch-select"
        className={barCss}
        value={values.chs[0]}
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
