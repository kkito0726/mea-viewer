import { InputLabel, InputLabelProps } from "../atom/InputLabel";
import {
  NumberSelectForm,
  NumberSelectFormProps,
} from "../atom/NumberSelectForm";

export type MEAViewerSelectFormProps = {
  inputLabelProps: InputLabelProps;
  numberSelectFormProps: NumberSelectFormProps;
};

export const MEAViewerSelectForm: React.FC<MEAViewerSelectFormProps> = ({
  inputLabelProps,
  numberSelectFormProps,
}) => {
  return (
    <div>
      <InputLabel name={inputLabelProps.name} label={inputLabelProps.label} />
      <NumberSelectForm
        name={numberSelectFormProps.name}
        value={numberSelectFormProps.value}
        handleChange={numberSelectFormProps.handleChange}
        disabled={numberSelectFormProps.disabled}
        optionValues={numberSelectFormProps.optionValues}
      />
    </div>
  );
};
