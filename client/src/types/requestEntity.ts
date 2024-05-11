import { ChFormValue } from "./ChFormValue";
import { HedValue } from "./HedValue";
import { ReadTime } from "./ReadTime";

export type RequestEntity = {
  readTime: ReadTime;
  hedValue: HedValue;
} & ChFormValue;
