import React, { ChangeEvent } from "react";

export type NumberFormProps = {
  name: string;
  value: number | undefined;
  min: number | undefined;
  max: number | undefined;
  step: number | undefined;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const NumberForm: React.FC<NumberFormProps> = ({
  name,
  value,
  min,
  max,
  step,
  onChange: handleChange,
}) => {
  const barCss =
    "mt-1 block w-full px-3 py-2 text-green-300 bg-zinc-800 border-none rounded-md shadow-sm focus: border-none";

  return (
    <input
      type="number"
      id={name}
      name={name}
      min={min}
      max={max}
      step={step}
      className={barCss}
      value={value}
      onChange={handleChange}
    />
  );
};
