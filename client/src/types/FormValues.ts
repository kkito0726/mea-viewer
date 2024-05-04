export type FormValues = {
  hed_path: string;
  start: number;
  end: number;
  volt_min: number;
  volt_max: number;
  x_ratio: number;
  y_ratio: number;
  dpi: number;
};

export const initFormValue: FormValues = {
  hed_path: "",
  start: 0,
  end: 5,
  volt_min: -200,
  volt_max: 200,
  x_ratio: 8,
  y_ratio: 8,
  dpi: 100,
};
