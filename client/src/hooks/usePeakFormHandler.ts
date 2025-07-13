import { ChangeEvent, useEffect, useState } from "react";
import { initPeakFormValue, PeakFormValue } from "../types/PeakFormValue";

export const usePeakFormHandler = () => {
  const [peakFormValue, setPeakFormValue] = useState<PeakFormValue>(() => {
    const stored = localStorage.getItem("peakFormValue");
    return stored ? JSON.parse(stored) : initPeakFormValue;
  });

  useEffect(() => {
    localStorage.setItem("peakFormValue", JSON.stringify(peakFormValue));
  }, [peakFormValue]);

  const handlePeakFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    if (type === "checkbox") {
      setPeakFormValue({
        ...peakFormValue,
        [name]: checked,
      });
    } else if (type === "number") {
      setPeakFormValue({
        ...peakFormValue,
        [name]: parseInt(value),
      });
    }
  };
  return { peakFormValue, handlePeakFormChange };
};
