import React from "react";

export type InputLabelProps = {
  label: string;
};

export const InputLabel: React.FC<InputLabelProps> = ({ label }) => {
  return (
    <label className="block text-xs font-medium text-slate-400 tracking-wide uppercase font-ui mb-1.5">
      {label}
    </label>
  );
};
