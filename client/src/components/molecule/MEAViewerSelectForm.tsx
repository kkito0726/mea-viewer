import { ChangeEvent } from "react";
import { InputLabel } from "../atom/InputLabel";
import { NumberSelectForm } from "../atom/NumberSelectForm";

type Props = {
  label: string;
  name: string;
  value: number;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  disabled: boolean;
  optionValues: number[];
};

export const MEAViewerSelectForm: React.FC<Props> = ({
  label,
  name,
  value,
  onChange,
  disabled,
  optionValues,
}) => {
  return (
    <div>
      <InputLabel label={label} />
      <NumberSelectForm
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        optionValues={optionValues}
      />
    </div>
  );
};
