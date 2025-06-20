import { NumberForm, NumberFormProps } from "../atom/NumberForm";
import { InputLabelProps, InputLabel } from "../atom/InputLabel";

export type InputFormProps = {
  inputLabelProps: InputLabelProps;
  numberFormProps: NumberFormProps;
};

export const MEAViewerInputForm: React.FC<InputFormProps> = ({
  inputLabelProps,
  numberFormProps,
}) => {
  return (
    <div>
      <InputLabel name={inputLabelProps.name} label={inputLabelProps.label} />
      <NumberForm
        name={numberFormProps.name}
        value={numberFormProps.value}
        min={numberFormProps.min}
        max={numberFormProps.max}
        step={numberFormProps.step}
        handleChange={numberFormProps.handleChange}
      />
    </div>
  );
};
