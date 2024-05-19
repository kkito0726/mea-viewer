import { useState } from "react";

import { PeakRequestEntity, RequestEntity } from "../types/requestEntity";
import { ChFormValue, initChFormValue } from "../types/ChFormValue";
import { HedValue } from "../types/HedValue";
import {
  fetchRasterPlot,
  fetchShowAll,
  fetchShowDetection,
  fetchShowSingle,
} from "./fetchApi";
import { PageName } from "../enum/PageName";
import { PeakFormValue } from "../types/PeakFormValue";

export const useDataSubmission = (
  pageName: string,
  activeChs: number[],
  meaData: Float32Array[],
  hedValue: HedValue,
  peakFormValue: PeakFormValue
) => {
  const [values, setValues] = useState<ChFormValue>(initChFormValue);

  const [imgSrc, setImgSrc] = useState<string>("");
  const [isPost, setIsPost] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "ch") {
      setValues({
        ...values,
        chs: [parseInt(value)],
      });
    } else {
      setValues({
        ...values,
        [name]: parseFloat(value),
      });
    }
  };

  const handleInitialize = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setValues(initChFormValue);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!meaData[0]) {
      alert("MEAデータが読み込まれていません");
      return;
    }
    setIsPost(true);
    const resData = await handleFetch();
    if (resData) {
      setImgSrc(resData.imgSrc);
    }

    setIsPost(false);
  };

  const handleFetch = async () => {
    const requestEntity: RequestEntity = {
      readTime: {
        start: Math.floor(meaData[0][0]),
        end: Math.round(meaData[0][meaData[0].length - 1]),
      },
      hedValue: hedValue,
      ...values,
    };
    switch (pageName) {
      case PageName.SHOW_ALL:
        return await fetchShowAll(requestEntity, meaData);
        break;
      case PageName.SHOW_SINGLE:
        return await fetchShowSingle(requestEntity, meaData);
        break;
      case PageName.SHOW_DETECTION:
        return await fetchShowDetection(requestEntity, meaData, activeChs);
        break;
      case PageName.RASTER_PLOT:
        {
          const peakRequestEntity: PeakRequestEntity = {
            ...requestEntity,
            peakFormValue,
          };
          return await fetchRasterPlot(peakRequestEntity, meaData, activeChs);
        }
        break;
    }
  };
  return {
    values,
    imgSrc,
    isPost,
    handleChange,
    handleInitialize,
    handleSubmit,
  } as const;
};
