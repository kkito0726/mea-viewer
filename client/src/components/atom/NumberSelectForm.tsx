import { ChangeEvent } from "react";

export type NumberSelectFormProps = {
  name: string;
  value: number;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  disabled: boolean;
  optionValues: number[];
};

export const NumberSelectForm: React.FC<NumberSelectFormProps> = ({
  name,
  value,
  onChange: handleChange,
  disabled,
  optionValues,
}) => {
  return (
    <select
      className="block w-full px-3 py-2 font-mono text-sm text-green-400 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-md transition-colors duration-150 hover:border-[var(--border-default)] focus:border-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer appearance-none"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2364748b' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 10px center",
      }}
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
