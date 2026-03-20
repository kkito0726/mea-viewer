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
  return (
    <input
      type="number"
      id={name}
      name={name}
      min={min}
      max={max}
      step={step}
      className="block w-full px-3 py-2 font-mono text-sm text-green-400 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-md transition-colors duration-150 hover:border-[var(--border-default)] focus:border-green-500/50 placeholder:text-slate-600"
      value={value}
      onChange={handleChange}
    />
  );
};
