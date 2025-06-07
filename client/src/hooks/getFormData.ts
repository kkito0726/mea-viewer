import { FormValues } from "../types/FormValues";

type FormData = {
  name: string;
  label: string;
  value: number;
  min: number | undefined;
  step: number;
};

export const getFormData = (values: FormValues): FormData[] => {
  return [
    {
      name: "start",
      label: "Start (s)",
      value: values.start,
      min: 0,
      step: 0.01,
    },
    {
      name: "end",
      label: "End (s)",
      value: values.end,
      min: values.start,
      step: 0.01,
    },
    {
      name: "volt_min",
      label: "Volt_min (μV)",
      value: values.volt_min,
      min: undefined,
      step: 1,
    },
    {
      name: "volt_max",
      label: "Volt_max (μV)",
      value: values.volt_max,
      min: undefined,
      step: 1,
    },
    {
      name: "x_ratio",
      label: "横比率",
      value: values.x_ratio,
      min: 0,
      step: 1,
    },
    {
      name: "y_ratio",
      label: "縦比率",
      value: values.y_ratio,
      min: 0,
      step: 1,
    },
    {
      name: "dpi",
      label: "dpi",
      value: values.dpi,
      min: 0,
      step: 1,
    },
    {
      name: "electrode_distance",
      label: "電極間距離 (μm)",
      value: values.electrode_distance,
      min: 0,
      step: 1,
    },
  ];
};
