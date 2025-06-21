import React from "react";

export type InputLabelProps = {
  name: string;
  label: string;
};

export const InputLabel: React.FC<InputLabelProps> = ({ name, label }) => {
  const labelCss = "block text-sm font-medium text-gray-300 px-1";

  return (
    <label htmlFor={name} className={labelCss}>
      {label}
    </label>
  );
};
