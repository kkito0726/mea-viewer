import React from "react";

export type InputLabelProps = {
  label: string;
};

export const InputLabel: React.FC<InputLabelProps> = ({ label }) => {
  const labelCss = "block text-sm font-medium text-gray-300 px-1";

  return (
    <label htmlFor="" className={labelCss}>
      {label}
    </label>
  );
};
