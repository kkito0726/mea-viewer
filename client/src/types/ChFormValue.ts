import { FormValues, initFormValue } from "./FormValues";

export type ChFormValue = {
  chs: number[];
} & FormValues;

export const initChFormValue: ChFormValue = {
  chs: [1],
  ...initFormValue,
};
