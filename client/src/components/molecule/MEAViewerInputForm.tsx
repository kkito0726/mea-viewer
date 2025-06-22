import { NumberForm } from "../atom/NumberForm";
import { InputLabel } from "../atom/InputLabel";

type Props = {
  label: string;
  name: string;
  value: number | undefined;
  max: number | undefined;
  min: number | undefined;
  step: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const MEAViewerInputForm: React.FC<Props> = ({
  label,
  name,
  value,
  max,
  min,
  step,
  onChange,
}) => {
  return (
    <div>
      <InputLabel label={label} />
      <NumberForm
        name={name}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={onChange}
      />
    </div>
  );
};
