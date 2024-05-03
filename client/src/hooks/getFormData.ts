import { FormValues } from "../types/FormValues";

export const getFormData = (values: FormValues) => {
  return [
    {
      name: "start",
      label: "Start (s)",
      value: values.start,
    },
    {
      name: "end",
      label: "End (s)",
      value: values.end,
    },
    {
      name: "volt_min",
      label: "Volt_min (μV)",
      value: values.volt_min,
    },
    {
      name: "volt_max",
      label: "Volt_max (μV)",
      value: values.volt_max,
    },
    {
      name: "x_ratio",
      label: "横比率",
      value: values.x_ratio,
    },
    {
      name: "y_ratio",
      label: "縦比率",
      value: values.y_ratio,
    },
    {
      name: "dpi",
      label: "dpi",
      value: values.dpi,
    },
  ];
};
