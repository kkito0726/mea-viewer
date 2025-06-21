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
    <div className="flex items-center">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
      />
      <label className="ml-2">{label}</label>
    </div>
  );
};
