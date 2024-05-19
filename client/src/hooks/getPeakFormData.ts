import { PeakFormValue } from "../types/PeakFormValue";

type PeakFormData = {
  name: string;
  label: string;
  value: number;
};

export const getPeakFormData = (value: PeakFormValue): PeakFormData[] => {
  return [
    {
      name: "distance",
      label: "distance",
      value: value.distance,
    },
    {
      name: "threshold",
      label: "threshold",
      value: value.threshold,
    },
  ];
};
