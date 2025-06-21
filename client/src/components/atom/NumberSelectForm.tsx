import { ChangeEvent } from "react";

export type NumberSelectFormProps = {
  name: string;
  value: number;
  handleChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  disabled: boolean;
  optionValues: number[];
};

export const NumberSelectForm: React.FC<NumberSelectFormProps> = ({
  name,
  value,
  handleChange,
  disabled,
  optionValues,
}) => {
  const barCss =
    "mt-1 block w-full px-3 py-2 text-green-300 bg-zinc-800 border-none rounded-md shadow-sm focus: border-none";

  return (
    <select
      className={barCss}
      value={value}
      onChange={handleChange}
      name={name}
      id={name}
      disabled={disabled}
    >
      {optionValues.map((value, i) => (
        <option key={i} value={value}>
          {value}
        </option>
      ))}
    </select>
  );
};
