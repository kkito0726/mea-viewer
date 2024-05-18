import { ChFormValue } from "./ChFormValue";
import { HedValue } from "./HedValue";
import { PeakFormValue } from "./PeakFormValue";
import { ReadTime } from "./ReadTime";

export type RequestEntity = {
  readTime: ReadTime;
  hedValue: HedValue;
} & ChFormValue;

export type PeakRequestEntity = {
  peakFormValue: PeakFormValue;
} & RequestEntity;
