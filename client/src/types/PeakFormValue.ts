export type PeakFormValue = {
  isPositive: boolean;
  isNegative: boolean;
  distance: number;
  threshold: number;
};

export const initPeakFormValue: PeakFormValue = {
  isPositive: false,
  isNegative: true,
  distance: 3000,
  threshold: 3,
};
