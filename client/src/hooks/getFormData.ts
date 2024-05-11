import { FormValues } from "../types/FormValues";

type FormData = {
  name: string;
  label: string;
  value: number;
  min: number | undefined;
};

export const getFormData = (values: FormValues): FormData[] => {
  return [
    {
      name: "start",
      label: "Start (s)",
      value: values.start,
      min: 0,
    },
    {
      name: "end",
      label: "End (s)",
      value: values.end,
      min: values.start,
    },
    {
      name: "volt_min",
      label: "Volt_min (μV)",
      value: values.volt_min,
      min: undefined,
    },
    {
      name: "volt_max",
      label: "Volt_max (μV)",
      value: values.volt_max,
      min: undefined,
    },
    {
      name: "x_ratio",
      label: "横比率",
      value: values.x_ratio,
      min: 0,
    },
    {
      name: "y_ratio",
      label: "縦比率",
      value: values.y_ratio,
      min: 0,
    },
    {
      name: "dpi",
      label: "dpi",
      value: values.dpi,
      min: 0,
    },
  ];
};
