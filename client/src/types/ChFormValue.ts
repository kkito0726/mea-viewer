import { FormValues, initFormValue } from "./FormValues";

export type ChFormValue = {
  chs: number[];
} & FormValues;

export const initChFormValue = (figType: string): ChFormValue => {
  return {
    chs: [1],
    ...initFormValue(figType),
  };
};
