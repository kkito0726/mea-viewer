import { FormValues, initFormValue } from "./FormValues";

export type ChFormValue = {
  ch: number;
} & FormValues;

export const initChFormValue: ChFormValue = {
  ch: 1,
  ...initFormValue,
};
