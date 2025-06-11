export type FormValues = {
  figType: string;
  start: number;
  end: number;
  volt_min: number;
  volt_max: number;
  x_ratio: number;
  y_ratio: number;
  dpi: number;
  electrode_distance: number;
};

export const initFormValue = (figType: string): FormValues => {
  return {
    figType: figType,
    start: 0,
    end: 5,
    volt_min: -200,
    volt_max: 200,
    x_ratio: 10,
    y_ratio: 8,
    dpi: 100,
    electrode_distance: 450,
  };
};
