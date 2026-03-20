import { ChangeEvent } from "react";

type Props = {
  name: string;
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label: string;
};
export const Checkbox: React.FC<Props> = ({
  name,
  checked,
  onChange,
  label,
}) => {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
      />
      <span className="text-sm text-slate-300 font-ui group-hover:text-slate-200 transition-colors select-none">
        {label}
      </span>
    </label>
  );
};
